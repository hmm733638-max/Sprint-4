using System.Net;
using System.Net.Http.Json;
using Sahur.Application.Abstractions;
using Sahur.Application.Products.Models;

namespace Sahur.Infrastructure.ExternalApis.FakeStore;

public sealed class FakeStoreProductReadRepository(HttpClient httpClient) : IProductReadRepository
{
    public async Task<IReadOnlyCollection<ProductReadModel>> GetAllAsync(
        CancellationToken cancellationToken)
    {
        var products = await httpClient.GetFromJsonAsync<List<FakeStoreProductDto>>(
            "products",
            cancellationToken) ?? [];

        return products.Select(Map).ToArray();
    }

    public async Task<IReadOnlyCollection<string>> GetCategoriesAsync(
        CancellationToken cancellationToken)
    {
        var categories = await httpClient.GetFromJsonAsync<List<string>>(
            "products/categories",
            cancellationToken) ?? [];

        return categories.ToArray();
    }

    public async Task<IReadOnlyCollection<ProductReadModel>> GetByCategoryAsync(
        string category,
        CancellationToken cancellationToken)
    {
        var encodedCategory = Uri.EscapeDataString(category);
        var products = await httpClient.GetFromJsonAsync<List<FakeStoreProductDto>>(
            $"products/category/{encodedCategory}",
            cancellationToken) ?? [];

        return products.Select(Map).ToArray();
    }

    public async Task<ProductReadModel?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken)
    {
        using var response = await httpClient.GetAsync($"products/{id}", cancellationToken);

        if (response.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        var product = await response.Content.ReadFromJsonAsync<FakeStoreProductDto>(
            cancellationToken: cancellationToken);

        return product is null ? null : Map(product);
    }

    private static ProductReadModel Map(FakeStoreProductDto product) =>
        new(
            product.Id,
            product.Title,
            product.Price,
            product.Description,
            product.Category,
            product.Image);
}
