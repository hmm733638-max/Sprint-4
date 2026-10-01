using Sahur.Application.Messaging;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Commands.UpdateProduct;

public sealed record UpdateProductCommand(
    int Id,
    string Title,
    decimal Price,
    string Description,
    string Category) : ICommand<ProductReadModel?>;
