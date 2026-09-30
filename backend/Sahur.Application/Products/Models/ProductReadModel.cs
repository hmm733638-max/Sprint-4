namespace Sahur.Application.Products.Models;

public sealed record ProductReadModel(
    int Id,
    string Title,
    decimal Price,
    string Description,
    string Category,
    string Image);
