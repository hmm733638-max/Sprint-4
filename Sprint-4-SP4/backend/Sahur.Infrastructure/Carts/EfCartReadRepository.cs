using Microsoft.EntityFrameworkCore;
using Sahur.Application.Abstractions;
using Sahur.Application.Carts.Models;
using Sahur.Infrastructure.Persistence;

namespace Sahur.Infrastructure.Carts;

public sealed class EfCartReadRepository(SahurDbContext dbContext) : ICartReadRepository
{
    public async Task<IReadOnlyCollection<CartReadModel>> GetAllAsync(CancellationToken cancellationToken) =>
        (await dbContext.Carts.AsNoTracking()
            .Include(cart => cart.Items)
            .OrderByDescending(cart => cart.CreatedOn)
            .ThenByDescending(cart => cart.Id)
            .ToArrayAsync(cancellationToken))
        .Select(CartReadModel.FromEntity)
        .ToArray();
}
