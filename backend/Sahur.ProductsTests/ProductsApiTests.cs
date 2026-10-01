using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Sahur.Application.Auth.Commands.Login;
using Sahur.Application.Products.Models;
using Sahur.Infrastructure.Persistence;
using Xunit;

namespace Sahur.ProductsTests;

public sealed class ProductsApiFactory : WebApplicationFactory<Program>
{
    public string Password { get; } = Convert.ToHexString(RandomNumberGenerator.GetBytes(24));
    private readonly string databaseName = Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureLogging(logging => logging.SetMinimumLevel(LogLevel.Warning));
        builder.ConfigureServices(services =>
        {
            services.AddDbContext<SahurDbContext>(options => options.UseInMemoryDatabase(databaseName));
            services.Configure<SeedUserOptions>(options =>
            {
                options.Users = Enumerable.Range(1, 4).ToDictionary(
                    id => id, id => new SeedUser { Username = $"productuser{id}", Password = Password });
            });
        });
    }
}

public sealed class ProductsApiTests
{
    [Fact]
    public async Task Catalog_Requires_Authentication()
    {
        await using var factory = new ProductsApiFactory();
        using var client = factory.CreateClient();
        Assert.Equal(HttpStatusCode.Unauthorized, (await client.GetAsync("/api/products")).StatusCode);
    }

    [Fact]
    public async Task Authenticated_User_Can_Read_Catalog_Categories_Filter_And_Detail()
    {
        await using var factory = new ProductsApiFactory();
        using var client = await CreateAuthenticatedClientAsync(factory, 4);

        var products = await client.GetFromJsonAsync<ProductReadModel[]>("/api/products");
        Assert.NotNull(products);
        Assert.True(products.Length >= 12);
        Assert.All(products, product =>
        {
            Assert.False(string.IsNullOrWhiteSpace(product.Title));
            Assert.True(product.Price > 0);
            Assert.StartsWith("/product-images/", product.ImageUrl);
        });

        var categories = await client.GetFromJsonAsync<string[]>("/api/products/categories");
        Assert.NotNull(categories);
        Assert.Contains("Electrónica", categories);

        var filtered = await client.GetFromJsonAsync<ProductReadModel[]>("/api/products/category/Electr%C3%B3nica");
        Assert.NotNull(filtered);
        Assert.NotEmpty(filtered);
        Assert.All(filtered, product => Assert.Equal("Electrónica", product.Category));

        var detail = await client.GetFromJsonAsync<ProductReadModel>("/api/products/1");
        Assert.NotNull(detail);
        Assert.False(string.IsNullOrWhiteSpace(detail.Description));
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/api/products/9999")).StatusCode);
    }

    [Fact]
    public async Task Client_Cannot_Update_Or_Delete_Products()
    {
        await using var factory = new ProductsApiFactory();
        using var client = await CreateAuthenticatedClientAsync(factory, 4);
        var update = new { Title = "No permitido", Price = 10.00m, Description = "No permitido", Category = "Prueba" };

        Assert.Equal(HttpStatusCode.Forbidden, (await client.PutAsJsonAsync("/api/products/1", update)).StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, (await client.DeleteAsync("/api/products/1")).StatusCode);
    }

    [Fact]
    public async Task Administrator_Can_Update_And_Delete_Product()
    {
        await using var factory = new ProductsApiFactory();
        using var client = await CreateAuthenticatedClientAsync(factory, 1);
        var update = new { Title = "Producto actualizado", Price = 123.45m, Description = "Descripción actualizada", Category = "Pruebas" };

        var updateResponse = await client.PutAsJsonAsync("/api/products/1", update);
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
        var updated = await updateResponse.Content.ReadFromJsonAsync<ProductReadModel>();
        Assert.NotNull(updated);
        Assert.Equal("Producto actualizado", updated.Title);
        Assert.Equal(123.45m, updated.Price);

        Assert.Equal(HttpStatusCode.NoContent, (await client.DeleteAsync("/api/products/12")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync("/api/products/12")).StatusCode);
    }

    private static async Task<HttpClient> CreateAuthenticatedClientAsync(ProductsApiFactory factory, int userId)
    {
        var client = factory.CreateClient();
        var login = await client.PostAsJsonAsync("/api/auth/login", new
        {
            Username = $"productuser{userId}", factory.Password
        });
        login.EnsureSuccessStatusCode();
        var session = await login.Content.ReadFromJsonAsync<LoginResult>();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", session!.AccessToken);
        return client;
    }
}
