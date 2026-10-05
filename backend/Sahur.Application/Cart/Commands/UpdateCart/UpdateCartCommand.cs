using Sahur.Application.Messaging;

namespace Sahur.Application.Cart.Commands.UpdateCart;

public sealed record UpdateCartCommand(
    int ProductId,
    int Quantity) : ICommand;
