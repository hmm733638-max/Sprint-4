using Sahur.Application.Abstractions;

namespace Sahur.Infrastructure.Persistence;

public sealed class EfUnitOfWork(SahurDbContext dbContext) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        dbContext.SaveChangesAsync(cancellationToken);
}
