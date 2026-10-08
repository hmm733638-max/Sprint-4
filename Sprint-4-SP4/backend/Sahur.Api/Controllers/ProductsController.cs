using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahur.Api.Contracts.Products;
using Sahur.Application.Products.Commands.CreateProduct;
using Sahur.Application.Products.Commands.DeleteProduct;
using Sahur.Application.Products.Commands.UpdateProduct;
using Sahur.Application.Products.Models;
using Sahur.Application.Products.Queries.GetProductById;
using Sahur.Application.Products.Queries.GetProductCategories;
using Sahur.Application.Products.Queries.GetProducts;
using Sahur.Application.Products.Queries.GetProductsByCategory;

namespace Sahur.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/products")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class ProductsController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<ProductReadModel>>> GetAll(
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

    [Authorize(Roles = "Administrador")]
    [HttpPost]
    public async Task<ActionResult<ProductReadModel>> Create(
        CreateProductRequest request,
        CancellationToken cancellationToken)
    {
        var product = await sender.Send(new CreateProductCommand(
            request.Title,
            request.Price,
            request.Description,
            request.ImageUrl,
            request.Category), cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [Authorize(Roles = "Administrador")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductReadModel>> Update(
        int id,
        UpdateProductRequest request,
        CancellationToken cancellationToken)
    {
        var product = await sender.Send(new UpdateProductCommand(
            id,
            request.Title,
            request.Price,
            request.Description,
            request.Category), cancellationToken);

        return product is null ? NotFound() : Ok(product);
    }

    [Authorize(Roles = "Administrador")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await sender.Send(new DeleteProductCommand(id), cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
