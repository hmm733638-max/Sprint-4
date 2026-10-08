using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;
using Sahur.Application.Products.Models;
using Sahur.Domain.Products;

namespace Sahur.Application.Products.Commands.CreateProduct;

public sealed class CreateProductCommandHandler(
    IProductWriteRepository products,
    IUnitOfWork unitOfWork)
    : ICommandHandler<CreateProductCommand, ProductReadModel>
{
    public async Task<ProductReadModel> Handle(
        CreateProductCommand request,
        CancellationToken cancellationToken)
    {
        var product = Product.Create(
            request.Title,
            request.Price,
            request.Description,
            request.Category,
            request.ImageUrl);

        await products.AddAsync(product, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return ProductReadModel.FromEntity(product);
    }
}
