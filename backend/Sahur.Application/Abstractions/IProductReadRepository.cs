using Sahur.Application.Products.Models;

namespace Sahur.Application.Abstractions;

public interface IProductReadRepository
{
    Task<IReadOnlyCollection<ProductReadModel>> GetAllAsync(CancellationToken cancellationToken);
    Task<IReadOnlyCollection<ProductReadModel>> GetByCategoryAsync(string category, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<string>> GetCategoriesAsync(CancellationToken cancellationToken);
    Task<ProductReadModel?> GetByIdAsync(int id, CancellationToken cancellationToken);
}
