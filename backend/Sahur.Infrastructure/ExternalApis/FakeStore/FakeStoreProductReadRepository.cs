using System.Net.Http.Json;
using Sahur.Application.Abstractions;
using Sahur.Application.Products.Queries.GetProducts;
namespace Sahur.Infrastructure.ExternalApis.FakeStore;
public sealed class FakeStoreProductReadRepository(HttpClient httpClient) : IProductReadRepository
{
    public async Task<IReadOnlyCollection<ProductReadModel>> GetAllAsync(CancellationToken cancellationToken)
    {
        var products = await httpClient.GetFromJsonAsync<List<FakeStoreProductDto>>("products", cancellationToken) ?? [];
        return products.Select(p => new ProductReadModel(p.Id, p.Title, p.Price, p.Description, p.Category, p.Image)).ToArray();
    }
}
