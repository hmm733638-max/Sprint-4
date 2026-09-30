using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Sahur.Application.Abstractions;
using Sahur.Infrastructure.Auth;
using Sahur.Infrastructure.Persistence;
using Sahur.Infrastructure.System;
using Sahur.Infrastructure.Users;

namespace Sahur.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddDbContext<SahurDbContext>(options =>
            options.UseInMemoryDatabase("SahurDb"));

        services.AddScoped<IUnitOfWork, EfUnitOfWork>();
        services.AddScoped<ISystemStatusReadRepository, InMemorySystemStatusReadRepository>();
        services.AddScoped<IUserReadRepository, EfUserReadRepository>();
        services.AddScoped<IUserSessionReadRepository, EfUserSessionReadRepository>();
        services.AddScoped<IUserSessionWriteRepository, EfUserSessionWriteRepository>();
        services.AddSingleton<IPasswordHashService, IdentityPasswordHashService>();
        services.AddSingleton<IAccessTokenService, RandomAccessTokenService>();
        services.AddSingleton(TimeProvider.System);
        services.AddScoped<SahurDatabaseSeeder>();

        return services;
    }
}
