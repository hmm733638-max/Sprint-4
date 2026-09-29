using Sahur.Application.Products.Queries.GetProducts;
namespace Sahur.Application.Abstractions;
public interface IProductReadRepository { Task<IReadOnlyCollection<ProductReadModel>> GetAllAsync(CancellationToken cancellationToken); }
