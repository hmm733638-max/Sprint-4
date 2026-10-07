using Sahur.Domain.Auth;

namespace Sahur.Application.Abstractions;

public interface IUserSessionReadRepository
{
    Task<UserSession?> GetByTokenHashAsync(string tokenHash, CancellationToken cancellationToken);
}
