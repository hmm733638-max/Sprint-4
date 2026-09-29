using MediatR;
using Sahur.Application.Abstractions;
namespace Sahur.Application.Products.Queries.GetProducts;
public sealed class GetProductsQueryHandler(IProductReadRepository repository) : IRequestHandler<GetProductsQuery, IReadOnlyCollection<ProductReadModel>>
{
    public Task<IReadOnlyCollection<ProductReadModel>> Handle(GetProductsQuery request, CancellationToken cancellationToken) => repository.GetAllAsync(cancellationToken);
}
