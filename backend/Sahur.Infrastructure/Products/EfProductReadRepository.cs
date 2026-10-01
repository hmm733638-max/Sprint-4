using Microsoft.EntityFrameworkCore;
using Sahur.Application.Abstractions;
using Sahur.Application.Products.Models;
using Sahur.Infrastructure.Persistence;

namespace Sahur.Infrastructure.Products;

public sealed class EfProductReadRepository(SahurDbContext dbContext)
    : IProductReadRepository
{
    public async Task<IReadOnlyCollection<ProductReadModel>> GetAllAsync(CancellationToken cancellationToken) =>
        await dbContext.Products
            .AsNoTracking()
            .OrderBy(product => product.Id)
            .Select(product => new ProductReadModel(
                product.Id,
                product.Title,
                product.Price,
                product.Description,
                product.Category,
                product.ImageUrl))
            .ToArrayAsync(cancellationToken);

    public async Task<IReadOnlyCollection<ProductReadModel>> GetByCategoryAsync(
        string category,
        CancellationToken cancellationToken)
    {
        var normalized = category.Trim().ToUpperInvariant();
        return await dbContext.Products
            .AsNoTracking()
            .Where(product => product.Category.ToUpper() == normalized)
            .OrderBy(product => product.Id)
            .Select(product => new ProductReadModel(
                product.Id,
                product.Title,
                product.Price,
                product.Description,
                product.Category,
                product.ImageUrl))
            .ToArrayAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<string>> GetCategoriesAsync(CancellationToken cancellationToken) =>
        await dbContext.Products
            .AsNoTracking()
            .Select(product => product.Category)
            .Distinct()
            .OrderBy(category => category)
            .ToArrayAsync(cancellationToken);

    public Task<ProductReadModel?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
        dbContext.Products
            .AsNoTracking()
            .Where(product => product.Id == id)
            .Select(product => new ProductReadModel(
                product.Id,
                product.Title,
                product.Price,
                product.Description,
                product.Category,
                product.ImageUrl))
            .SingleOrDefaultAsync(cancellationToken);
}
