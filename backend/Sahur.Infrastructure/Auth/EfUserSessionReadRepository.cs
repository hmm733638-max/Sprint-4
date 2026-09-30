using Microsoft.EntityFrameworkCore;
using Sahur.Application.Abstractions;
using Sahur.Domain.Auth;
using Sahur.Infrastructure.Persistence;

namespace Sahur.Infrastructure.Auth;

public sealed class EfUserSessionReadRepository(SahurDbContext dbContext) : IUserSessionReadRepository
{
    public Task<UserSession?> GetByTokenHashAsync(string tokenHash, CancellationToken cancellationToken) =>
        dbContext.UserSessions.AsNoTracking()
            .SingleOrDefaultAsync(session => session.TokenHash == tokenHash, cancellationToken);
}
