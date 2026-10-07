using Microsoft.EntityFrameworkCore;
using Sahur.Application.Abstractions;
using Sahur.Application.System.Queries.GetSystemStatus;
using Sahur.Infrastructure.Persistence;

namespace Sahur.Infrastructure.System;

public sealed class InMemorySystemStatusReadRepository(SahurDbContext dbContext)
    : ISystemStatusReadRepository
{
    public async Task<SystemStatusReadModel> GetAsync(CancellationToken cancellationToken)
    {
        var available = await dbContext.Database.CanConnectAsync(cancellationToken);
        var provider = dbContext.Database.ProviderName ?? "EF Core InMemory";

        return new SystemStatusReadModel(
            "SAHUR Sprint 4",
            provider,
            available);
    }
}
