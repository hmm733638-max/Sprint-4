using MediatR;
using Sahur.Application.Abstractions;
using Sahur.Application.Products.Models;

namespace Sahur.Application.Products.Queries.GetProductById;

public sealed class GetProductByIdQueryHandler(IProductReadRepository repository)
    : IRequestHandler<GetProductByIdQuery, ProductReadModel?>
{
    public Task<ProductReadModel?> Handle(
        GetProductByIdQuery request,
        CancellationToken cancellationToken) =>
        repository.GetByIdAsync(request.Id, cancellationToken);
}
