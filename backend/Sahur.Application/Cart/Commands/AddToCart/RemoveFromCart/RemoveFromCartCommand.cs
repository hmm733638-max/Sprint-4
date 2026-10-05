using Sahur.Application.Messaging;

namespace Sahur.Application.Cart.Commands.RemoveFromCart;

public sealed record RemoveFromCartCommand(
    int ProductId) : ICommand;