using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Sahur.Application.Abstractions;
using Sahur.Application.Auth;
using Sahur.Application.Auth.Commands.Login;
using Sahur.Infrastructure.Persistence;
using Xunit;

namespace Sahur.AuthTests;

public sealed class TestClock : TimeProvider
{
    private DateTimeOffset now = DateTimeOffset.UtcNow;
    public override DateTimeOffset GetUtcNow() => now;
    public void Advance(TimeSpan duration) => now += duration;
}

public sealed class AuthApiFactory : WebApplicationFactory<Program>
{
    public string Password { get; } = Convert.ToHexString(RandomNumberGenerator.GetBytes(24));
    public TestClock Clock { get; } = new();
    private readonly string databaseName = Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureLogging(logging => logging.SetMinimumLevel(LogLevel.Warning));
        builder.ConfigureServices(services =>
        {
            services.AddSingleton<TimeProvider>(Clock);
            services.AddDbContext<SahurDbContext>(options => options.UseInMemoryDatabase(databaseName));
            services.Configure<SeedUserOptions>(options =>
            {
                options.Users = Enumerable.Range(1, 4).ToDictionary(
                    id => id, id => new SeedUser { Username = $"testuser{id}", Password = Password });
            });
        });
    }
}

public sealed class AuthApiTests : IClassFixture<AuthApiFactory>
{
    private readonly AuthApiFactory factory;
    private readonly HttpClient client;

    public AuthApiTests(AuthApiFactory factory)
    {
        this.factory = factory;
        client = factory.CreateClient();
    }

    [Theory]
    [InlineData(1, "Administrador")]
    [InlineData(2, "Administrador")]
    [InlineData(3, "Auditor")]
    [InlineData(4, "Cliente")]
    public async Task Login_Returns_Token_And_Server_Assigned_Role(int id, string role)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            Username = $"  TESTUSER{id}  ", factory.Password, Role = "Administrador", Id = 1
        });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var session = await response.Content.ReadFromJsonAsync<LoginResult>();
        Assert.NotNull(session);
        Assert.Equal(id, session.User.Id);
        Assert.Equal(role, session.User.Role);
        Assert.Equal("Bearer", session.TokenType);
        Assert.Equal(64, session.AccessToken.Length);
        Assert.True(session.ExpiresAt > factory.Clock.GetUtcNow());
        var body = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain("password", body, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain(factory.Password, body);

        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", session.AccessToken);
        var me = await client.SendAsync(request);
        Assert.Equal(HttpStatusCode.OK, me.StatusCode);
        Assert.Equal(session.User, await me.Content.ReadFromJsonAsync<AuthenticatedUserReadModel>());
    }

    [Theory]
    [InlineData("testuser1")]
    [InlineData("missing-user")]
    public async Task Invalid_Credentials_Return_Generic_401(string username)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new
        {
            Username = username, Password = Guid.NewGuid().ToString()
        });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.Equal("Usuario o contraseña inválidos", error!["message"]);
    }

    [Theory]
    [InlineData("", "x")]
    [InlineData("testuser1", "")]
    [InlineData("   ", "x")]
    public async Task Missing_Credentials_Return_400(string username, string password)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new { username, password });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("forged-token")]
    public async Task Me_Rejects_Missing_Or_Unknown_Token(string? token)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        if (token is not null)
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await client.SendAsync(request);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Contains(response.Headers.WwwAuthenticate, value => value.Scheme == "Bearer");
    }

    [Fact]
    public async Task Me_Rejects_Expired_Session()
    {
        await using var isolatedFactory = new AuthApiFactory();
        using var isolatedClient = isolatedFactory.CreateClient();
        var response = await isolatedClient.PostAsJsonAsync("/api/auth/login", new
        {
            Username = "testuser1", isolatedFactory.Password
        });
        var session = await response.Content.ReadFromJsonAsync<LoginResult>();
        isolatedFactory.Clock.Advance(TimeSpan.FromHours(1));
        isolatedClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", session!.AccessToken);
        Assert.Equal(HttpStatusCode.Unauthorized, (await isolatedClient.GetAsync("/api/auth/me")).StatusCode);
    }

    [Fact]
    public async Task Database_Stores_Hashes_And_Seeder_Is_Idempotent()
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new { Username = "testuser4", factory.Password });
        var session = await response.Content.ReadFromJsonAsync<LoginResult>();
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<SahurDbContext>();
        var passwords = scope.ServiceProvider.GetRequiredService<IPasswordHashService>();
        var tokens = scope.ServiceProvider.GetRequiredService<IAccessTokenService>();
        var user = await db.Users.AsNoTracking().SingleAsync(user => user.Id == 4);
        Assert.NotEqual(factory.Password, user.PasswordHash);
        Assert.True(passwords.Verify(user.PasswordHash, factory.Password));
        Assert.True(await db.UserSessions.AnyAsync(stored => stored.TokenHash == tokens.Hash(session!.AccessToken)));
        Assert.False(await db.UserSessions.AnyAsync(stored => stored.TokenHash == session!.AccessToken));
        await scope.ServiceProvider.GetRequiredService<SahurDatabaseSeeder>().SeedAsync();
        Assert.Equal(4, await db.Users.CountAsync());
    }

    [Fact]
    public async Task Reading_Current_User_Does_Not_Modify_Persistence()
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new { Username = "testuser3", factory.Password });
        var session = await response.Content.ReadFromJsonAsync<LoginResult>();
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<SahurDbContext>();
        var count = await db.UserSessions.CountAsync();
        using var request = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", session!.AccessToken);
        Assert.Equal(HttpStatusCode.OK, (await client.SendAsync(request)).StatusCode);
        Assert.Equal(count, await db.UserSessions.CountAsync());
    }
}
