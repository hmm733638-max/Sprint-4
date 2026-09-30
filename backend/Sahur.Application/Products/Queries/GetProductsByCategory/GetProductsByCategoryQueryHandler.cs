using MediatR;
using Sahur.Application.Abstractions;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Queries.GetProductsByCategory;

public sealed class GetProductsByCategoryQueryHandler(IProductReadRepository repository)
    : IRequestHandler<GetProductsByCategoryQuery, IReadOnlyCollection<ProductReadModel>>
{
    public Task<IReadOnlyCollection<ProductReadModel>> Handle(
        GetProductsByCategoryQuery request,
        CancellationToken cancellationToken) =>
        repository.GetByCategoryAsync(request.Category, cancellationToken);
}
