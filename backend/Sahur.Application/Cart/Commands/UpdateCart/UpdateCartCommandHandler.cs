using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;

namespace Sahur.Application.Cart.Commands.UpdateCart;

public sealed class UpdateCartCommandHandler(
    IProductReadRepository products)
    : ICommandHandler<UpdateCartCommand>
{
    public async Task Handle(
        UpdateCartCommand request,
        CancellationToken cancellationToken)
    {
        if (request.Quantity <= 0)
            throw new ArgumentOutOfRangeException(
                nameof(request.Quantity),
                "La cantidad debe ser mayor que cero.");

        var product = await products.GetByIdAsync(
            request.ProductId,
            cancellationToken);

        if (product is null)
            throw new KeyNotFoundException("El producto no existe.");
    }
}