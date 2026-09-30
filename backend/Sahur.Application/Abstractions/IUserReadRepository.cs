using Sahur.Domain.Users;

namespace Sahur.Application.Abstractions;

public interface IUserReadRepository
{
    Task<User?> GetByUsernameAsync(string username, CancellationToken cancellationToken);
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken);
}
