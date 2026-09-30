using Sahur.Domain.Auth;

namespace Sahur.Application.Abstractions;

public interface IUserSessionWriteRepository
{
    Task AddAsync(UserSession session, CancellationToken cancellationToken);
}
