using Sahur.Domain.Products;

namespace Sahur.Application.Abstractions;

public interface IProductWriteRepository
{
    Task<Product?> GetByIdAsync(int id, CancellationToken cancellationToken);
    void Delete(Product product);
}
