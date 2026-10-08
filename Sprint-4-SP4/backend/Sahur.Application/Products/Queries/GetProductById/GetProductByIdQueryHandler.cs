using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Queries.GetProductById;

public sealed class GetProductByIdQueryHandler(IProductReadRepository repository)
    : IQueryHandler<GetProductByIdQuery, ProductReadModel?>
{
    public Task<ProductReadModel?> Handle(
        GetProductByIdQuery request,
        CancellationToken cancellationToken) =>
        repository.GetByIdAsync(request.Id, cancellationToken);
}
