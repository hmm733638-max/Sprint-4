using Sahur.Domain.Users;

namespace Sahur.Application.Users.Models;

public sealed record UserDirectoryReadModel(int Id, string FullName, string Email, string Phone, string Username, string Role)
{
    public static UserDirectoryReadModel FromEntity(User user) => new(
        user.Id,
        user.FullName,
        user.Email,
        user.Phone,
        user.Username,
        user.Role.ToString());
}
