using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;

namespace Sahur.Application.Auth.Queries.AuthenticateSession;

public sealed class AuthenticateSessionQueryHandler(
    IUserSessionReadRepository sessions,
    IUserReadRepository users,
    IAccessTokenService tokens,
    TimeProvider clock) : IQueryHandler<AuthenticateSessionQuery, AuthenticatedUserReadModel?>
{
    public async Task<AuthenticatedUserReadModel?> Handle(
        AuthenticateSessionQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.AccessToken) || request.AccessToken.Length > 512)
            return null;

        var session = await sessions.GetByTokenHashAsync(tokens.Hash(request.AccessToken), cancellationToken);
        if (session is null || session.IsExpired(clock.GetUtcNow()))
            return null;

        var user = await users.GetByIdAsync(session.UserId, cancellationToken);
        return user is null ? null : AuthenticatedUserReadModel.FromUser(user);
    }
}
