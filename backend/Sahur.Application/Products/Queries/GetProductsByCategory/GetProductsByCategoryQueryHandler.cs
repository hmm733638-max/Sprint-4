using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Queries.GetProductsByCategory;

public sealed class GetProductsByCategoryQueryHandler(IProductReadRepository repository)
    : IQueryHandler<GetProductsByCategoryQuery, IReadOnlyCollection<ProductReadModel>>
{
    public Task<IReadOnlyCollection<ProductReadModel>> Handle(
        GetProductsByCategoryQuery request,
        CancellationToken cancellationToken) =>
        repository.GetByCategoryAsync(request.Category, cancellationToken);
}
