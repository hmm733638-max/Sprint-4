using Sahur.Domain.Carts;

namespace Sahur.Application.Carts.Models;

public sealed record CartItemReadModel(int ProductId, int Quantity);

public sealed record CartReadModel(int Id, int UserId, DateOnly CreatedOn, IReadOnlyCollection<CartItemReadModel> Products)
{
    public static CartReadModel FromEntity(Cart cart) => new(
        cart.Id,
        cart.UserId,
        cart.CreatedOn,
        cart.Items.Select(item => new CartItemReadModel(item.ProductId, item.Quantity)).ToArray());
}
