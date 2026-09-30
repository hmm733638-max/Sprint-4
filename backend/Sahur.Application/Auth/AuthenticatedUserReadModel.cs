using Sahur.Domain.Users;

namespace Sahur.Application.Auth;

public sealed record AuthenticatedUserReadModel(int Id, string Username, string Role)
{
    public static AuthenticatedUserReadModel FromUser(User user) =>
        new(user.Id, user.Username, user.Role.ToString());
}
