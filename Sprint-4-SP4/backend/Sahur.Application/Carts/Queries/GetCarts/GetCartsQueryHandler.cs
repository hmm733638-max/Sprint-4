using Sahur.Application.Abstractions;
using Sahur.Application.Carts.Models;
using Sahur.Application.Messaging;

namespace Sahur.Application.Carts.Queries.GetCarts;

public sealed class GetCartsQueryHandler(ICartReadRepository carts)
    : IQueryHandler<GetCartsQuery, IReadOnlyCollection<CartReadModel>>
{
    public Task<IReadOnlyCollection<CartReadModel>> Handle(
        GetCartsQuery request,
        CancellationToken cancellationToken) => carts.GetAllAsync(cancellationToken);
}
