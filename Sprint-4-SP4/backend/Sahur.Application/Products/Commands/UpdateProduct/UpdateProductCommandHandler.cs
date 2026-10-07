using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Commands.UpdateProduct;

public sealed class UpdateProductCommandHandler(
    IProductWriteRepository products,
    IUnitOfWork unitOfWork)
    : ICommandHandler<UpdateProductCommand, ProductReadModel?>
{
    public async Task<ProductReadModel?> Handle(
        UpdateProductCommand request,
        CancellationToken cancellationToken)
    {
        var product = await products.GetByIdAsync(request.Id, cancellationToken);
        if (product is null)
            return null;

        product.Update(request.Title, request.Price, request.Description, request.Category);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return ProductReadModel.FromEntity(product);
    }
}
