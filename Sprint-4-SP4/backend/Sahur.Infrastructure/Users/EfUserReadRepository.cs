using Microsoft.EntityFrameworkCore;
using Sahur.Application.Abstractions;
using Sahur.Domain.Users;
using Sahur.Application.Users.Models;
using Sahur.Infrastructure.Persistence;

namespace Sahur.Infrastructure.Users;

public sealed class EfUserReadRepository(SahurDbContext dbContext) : IUserReadRepository
{
    public Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken)
    {
        var normalizedUsername = User.NormalizeUsername(username);
        return dbContext.Users.AsNoTracking()
            .SingleOrDefaultAsync(user => user.NormalizedUsername == normalizedUsername, cancellationToken);
    }

    public Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
        dbContext.Users.AsNoTracking().SingleOrDefaultAsync(user => user.Id == id, cancellationToken);

    public async Task<IReadOnlyCollection<UserDirectoryReadModel>> GetAllAsync(CancellationToken cancellationToken) =>
        (await dbContext.Users.AsNoTracking()
            .OrderBy(user => user.Id)
            .ToArrayAsync(cancellationToken))
        .Select(UserDirectoryReadModel.FromEntity)
        .ToArray();
}
