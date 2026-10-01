using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;

namespace Sahur.Application.Products.Queries.GetProductCategories;

public sealed class GetProductCategoriesQueryHandler(IProductReadRepository repository)
    : IQueryHandler<GetProductCategoriesQuery, IReadOnlyCollection<string>>
{
    public Task<IReadOnlyCollection<string>> Handle(
        GetProductCategoriesQuery request,
        CancellationToken cancellationToken) =>
        repository.GetCategoriesAsync(cancellationToken);
}
