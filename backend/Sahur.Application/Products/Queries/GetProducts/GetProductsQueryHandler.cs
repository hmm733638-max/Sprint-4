using MediatR;
using Sahur.Application.Abstractions;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Queries.GetProducts;

public sealed class GetProductsQueryHandler(IProductReadRepository repository)
    : IRequestHandler<GetProductsQuery, IReadOnlyCollection<ProductReadModel>>
{
    public Task<IReadOnlyCollection<ProductReadModel>> Handle(
        GetProductsQuery request,
        CancellationToken cancellationToken) =>
        repository.GetAllAsync(cancellationToken);
}
