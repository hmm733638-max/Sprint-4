using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;

namespace Sahur.Application.Auth.Queries.GetCurrentUser;

public sealed class GetCurrentUserQueryHandler(IUserReadRepository users)
    : IQueryHandler<GetCurrentUserQuery, AuthenticatedUserReadModel?>
{
    public async Task<AuthenticatedUserReadModel?> Handle(
        GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await users.GetByIdAsync(request.UserId, cancellationToken);
        return user is null ? null : AuthenticatedUserReadModel.FromUser(user);
    }
}
