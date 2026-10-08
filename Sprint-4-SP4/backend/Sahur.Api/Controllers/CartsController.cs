using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahur.Application.Carts.Models;
using Sahur.Application.Carts.Queries.GetCarts;

namespace Sahur.Api.Controllers;

[ApiController]
[Authorize(Roles = "Administrador,Auditor")]
[Route("api/carts")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class CartsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<CartReadModel>>> GetAll(
        CancellationToken cancellationToken) =>
        Ok(await sender.Send(new GetCartsQuery(), cancellationToken));
}
