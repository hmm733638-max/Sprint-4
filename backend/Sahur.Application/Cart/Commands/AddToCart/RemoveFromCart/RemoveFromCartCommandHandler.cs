using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;

namespace Sahur.Application.Cart.Commands.RemoveFromCart;

public sealed class RemoveFromCartCommandHandler(
    IProductReadRepository products)
    : ICommandHandler<RemoveFromCartCommand>
{
    public async Task Handle(
        RemoveFromCartCommand request,
        CancellationToken cancellationToken)
    {
        var product = await products.GetByIdAsync(
            request.ProductId,
            cancellationToken);

        if (product is null)
            throw new KeyNotFoundException("El producto no existe.");
    }
}