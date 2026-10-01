using Microsoft.EntityFrameworkCore;
using Sahur.Application.Abstractions;
using Sahur.Domain.Products;
using Sahur.Infrastructure.Persistence;

namespace Sahur.Infrastructure.Products;

public sealed class EfProductWriteRepository(SahurDbContext dbContext)
    : IProductWriteRepository
{
    public Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
        dbContext.Products.SingleOrDefaultAsync(product => product.Id == id, cancellationToken);

    public async Task AddAsync(Product product, CancellationToken cancellationToken) =>
        await dbContext.Products.AddAsync(product, cancellationToken);

    public void Delete(Product product) => dbContext.Products.Remove(product);
}
