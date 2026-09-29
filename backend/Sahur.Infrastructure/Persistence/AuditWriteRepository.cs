using Sahur.Application.Abstractions;
using Sahur.Domain.Entities;
namespace Sahur.Infrastructure.Persistence;
public sealed class AuditWriteRepository(SahurDbContext dbContext) : IAuditWriteRepository
{
    public async Task AddAsync(AuditEntry entry, CancellationToken cancellationToken)
    {
        await dbContext.AuditEntries.AddAsync(entry, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
