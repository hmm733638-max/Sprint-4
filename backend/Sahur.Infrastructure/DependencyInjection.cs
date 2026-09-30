using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Sahur.Application.Abstractions;
using Sahur.Infrastructure.Persistence;
using Sahur.Infrastructure.System;

namespace Sahur.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddDbContext<SahurDbContext>(options =>
            options.UseInMemoryDatabase("SahurDb"));

        services.AddScoped<IUnitOfWork, EfUnitOfWork>();
        services.AddScoped<ISystemStatusReadRepository, InMemorySystemStatusReadRepository>();

        return services;
    }
}
