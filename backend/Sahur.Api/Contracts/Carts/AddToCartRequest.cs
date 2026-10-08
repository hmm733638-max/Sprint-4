namespace Sahur.Api.Contracts.Carts;

public sealed record AddToCartRequest(
    int ProductId,
    int Quantity);