using Sahur.Domain.Products;

namespace Sahur.Application.Products.Models;

public sealed record ProductReadModel(
    int Id,
    string Title,
    decimal Price,
    string Description,
    string Category,
    string ImageUrl)
{
    public static ProductReadModel FromEntity(Product product) => new(
        product.Id,
        product.Title,
        product.Price,
        product.Description,
        product.Category,
        product.ImageUrl);
}
