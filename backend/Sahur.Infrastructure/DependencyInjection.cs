using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Sahur.Application.Abstractions;
using Sahur.Infrastructure.ExternalApis.FakeStore;
using Sahur.Infrastructure.Persistence;
namespace Sahur.Infrastructure;
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddDbContext<SahurDbContext>(options => options.UseInMemoryDatabase("SahurDb"));
        services.AddScoped<IAuditWriteRepository, AuditWriteRepository>();
        services.AddHttpClient<IProductReadRepository, FakeStoreProductReadRepository>(client => client.BaseAddress = new Uri("https://fakestoreapi.com/"));
        return services;
    }
}
