using Sahur.Application.Messaging;

namespace Sahur.Application.Cart.Commands.AddToCart;

public sealed record AddToCartCommand(
    int ProductId,
    int Quantity) : ICommand;