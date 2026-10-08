using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahur.Api.Contracts.Carts;
using Sahur.Application.Cart.Commands.AddToCart;
using Sahur.Application.Cart.Commands.RemoveFromCart;
using Sahur.Application.Cart.Commands.UpdateCart;

namespace Sahur.Api.Controllers;

[ApiController]
[Authorize(Roles = "Cliente")]
[Route("api/carts")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class CartsController(ISender sender) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Add(
        AddToCartRequest request,
        CancellationToken cancellationToken)
    {
        await sender.Send(
            new AddToCartCommand(
                request.ProductId,
                request.Quantity),
            cancellationToken);

        return Ok();
    }

    [HttpPut("{productId:int}")]
    public async Task<IActionResult> Update(
        int productId,
        UpdateCartRequest request,
        CancellationToken cancellationToken)
    {
        await sender.Send(
            new UpdateCartCommand(
                productId,
                request.Quantity),
            cancellationToken);

        return Ok();
    }

    [HttpDelete("{productId:int}")]
    public async Task<IActionResult> Remove(
        int productId,
        CancellationToken cancellationToken)
    {
        await sender.Send(
            new RemoveFromCartCommand(productId),
            cancellationToken);

        return Ok();
    }
}