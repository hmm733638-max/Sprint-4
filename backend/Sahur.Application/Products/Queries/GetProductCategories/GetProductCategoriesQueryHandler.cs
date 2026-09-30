using MediatR;
using Sahur.Application.Abstractions;

namespace Sahur.Application.Products.Queries.GetProductCategories;

public sealed class GetProductCategoriesQueryHandler(IProductReadRepository repository)
    : IRequestHandler<GetProductCategoriesQuery, IReadOnlyCollection<string>>
{
    public Task<IReadOnlyCollection<string>> Handle(
        GetProductCategoriesQuery request,
        CancellationToken cancellationToken) =>
        repository.GetCategoriesAsync(cancellationToken);
}
