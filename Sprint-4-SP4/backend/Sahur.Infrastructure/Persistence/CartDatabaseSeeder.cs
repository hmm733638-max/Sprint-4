using Microsoft.EntityFrameworkCore;
using Sahur.Domain.Carts;

namespace Sahur.Infrastructure.Persistence;

public sealed class CartDatabaseSeeder(SahurDbContext dbContext)
{
    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await dbContext.Carts.AnyAsync(cancellationToken))
            return;

        Cart[] carts =
        [
            new(1, 4, new DateOnly(2026, 9, 28), [new CartItem(1, 1), new CartItem(4, 2)]),
            new(2, 5, new DateOnly(2026, 9, 30), [new CartItem(2, 1), new CartItem(10, 3)]),
            new(3, 4, new DateOnly(2026, 10, 2), [new CartItem(7, 1), new CartItem(12, 1)])
        ];

        await dbContext.Carts.AddRangeAsync(carts, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
