using Microsoft.AspNetCore.Authentication;
using Sahur.Api.Authentication;
using Sahur.Application;
using Sahur.Infrastructure;
using Sahur.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddApplication();
builder.Services.AddInfrastructure();
builder.Services.Configure<SeedUserOptions>(builder.Configuration.GetSection("Seed"));
builder.Services.AddAuthentication(SahurBearerHandler.SchemeName)
    .AddScheme<AuthenticationSchemeOptions, SahurBearerHandler>(SahurBearerHandler.SchemeName, _ => { });
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    await scope.ServiceProvider.GetRequiredService<SahurDatabaseSeeder>().SeedAsync();
    await scope.ServiceProvider.GetRequiredService<ProductDatabaseSeeder>().SeedAsync();
}

app.UseCors("Frontend");
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

public partial class Program { }
