using Sahur.Domain.Users;
using Sahur.Application.Users.Models;

namespace Sahur.Application.Abstractions;

public interface IUserReadRepository
{
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken);
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken);
    Task<IReadOnlyCollection<UserDirectoryReadModel>> GetAllAsync(CancellationToken cancellationToken);
}
