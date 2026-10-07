using Sahur.Application.Carts.Models;

namespace Sahur.Application.Abstractions;

public interface ICartReadRepository
{
    Task<IReadOnlyCollection<CartReadModel>> GetAllAsync(CancellationToken cancellationToken);
}
