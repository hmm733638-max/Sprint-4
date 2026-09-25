using MediatR;
using Microsoft.AspNetCore.Mvc;
using Sahur.Application.Products.Queries.GetProducts;
namespace Sahur.Api.Controllers;
[ApiController]
[Route("api/products")]
public sealed class ProductsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<ProductReadModel>>> Get(CancellationToken cancellationToken) => Ok(await sender.Send(new GetProductsQuery(), cancellationToken));
}
