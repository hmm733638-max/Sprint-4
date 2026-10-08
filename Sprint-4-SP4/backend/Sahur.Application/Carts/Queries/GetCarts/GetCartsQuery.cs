using Sahur.Application.Carts.Models;
using Sahur.Application.Messaging;

namespace Sahur.Application.Carts.Queries.GetCarts;

public sealed record GetCartsQuery : IQuery<IReadOnlyCollection<CartReadModel>>;
