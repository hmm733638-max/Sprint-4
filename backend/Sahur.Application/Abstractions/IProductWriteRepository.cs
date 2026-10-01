using Sahur.Domain.Products;

namespace Sahur.Application.Abstractions;

public interface IProductWriteRepository
{
    Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task AddAsync(Product product, CancellationToken cancellationToken);
    void Delete(Product product);
}
