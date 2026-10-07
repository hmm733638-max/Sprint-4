using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;

namespace Sahur.Application.Products.Commands.DeleteProduct;

public sealed class DeleteProductCommandHandler(
    IProductWriteRepository products,
    IUnitOfWork unitOfWork)
    : ICommandHandler<DeleteProductCommand, bool>
{
    public async Task<bool> Handle(
        DeleteProductCommand request,
        CancellationToken cancellationToken)
    {
        var product = await products.GetByIdAsync(request.Id, cancellationToken);
        if (product is null)
            return false;

        products.Delete(product);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
