using Sahur.Application.Messaging;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Commands.CreateProduct;

public sealed record CreateProductCommand(
    string Title,
    decimal Price,
    string Description,
    string ImageUrl,
    string Category) : ICommand<ProductReadModel>;
