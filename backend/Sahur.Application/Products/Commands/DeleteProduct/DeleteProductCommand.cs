using Sahur.Application.Messaging;

namespace Sahur.Application.Products.Commands.DeleteProduct;

public sealed record DeleteProductCommand(int Id) : ICommand<bool>;
