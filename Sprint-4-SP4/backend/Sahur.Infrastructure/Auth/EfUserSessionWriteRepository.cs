using Sahur.Application.Abstractions;
using Sahur.Domain.Auth;
using Sahur.Infrastructure.Persistence;

namespace Sahur.Infrastructure.Auth;

public sealed class EfUserSessionWriteRepository(SahurDbContext dbContext) : IUserSessionWriteRepository
{
    public async Task AddAsync(UserSession session, CancellationToken cancellationToken) =>
        await dbContext.UserSessions.AddAsync(session, cancellationToken);
}
