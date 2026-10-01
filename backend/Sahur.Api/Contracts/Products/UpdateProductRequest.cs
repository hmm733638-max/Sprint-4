using System.ComponentModel.DataAnnotations;

namespace Sahur.Api.Contracts.Products;

public sealed record UpdateProductRequest(
    [Required, MaxLength(180)] string Title,
    [Range(typeof(decimal), "0.01", "9999999999999999")] decimal Price,
    [Required, MaxLength(1200)] string Description,
    [Required, MaxLength(80)] string Category);