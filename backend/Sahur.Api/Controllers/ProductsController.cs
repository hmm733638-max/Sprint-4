using MediatR;
using Microsoft.AspNetCore.Mvc;
using Sahur.Application.Products.Models;
using Sahur.Application.Products.Queries.GetProductById;
using Sahur.Application.Products.Queries.GetProductCategories;
using Sahur.Application.Products.Queries.GetProducts;
using Sahur.Application.Products.Queries.GetProductsByCategory;

namespace Sahur.Api.Controllers;

[ApiController]
[Route("api/products")]
public sealed class ProductsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<ProductReadModel>>> Get(
        CancellationToken cancellationToken) =>
        Ok(await sender.Send(new GetProductsQuery(), cancellationToken));

    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyCollection<string>>> GetCategories(
        CancellationToken cancellationToken) =>
        Ok(await sender.Send(new GetProductCategoriesQuery(), cancellationToken));

    [HttpGet("category/{category}")]
    public async Task<ActionResult<IReadOnlyCollection<ProductReadModel>>> GetByCategory(
        string category,
        CancellationToken cancellationToken) =>
        Ok(await sender.Send(new GetProductsByCategoryQuery(category), cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductReadModel>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var product = await sender.Send(new GetProductByIdQuery(id), cancellationToken);
        return product is null ? NotFound() : Ok(product);
    }
}
