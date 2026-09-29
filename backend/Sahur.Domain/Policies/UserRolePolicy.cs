using Sahur.Domain.Enums;

namespace Sahur.Domain.Policies;

public static class UserRolePolicy
{
    public static UserRole FromUserId(int userId)
    {
        if (userId <= 0)
        {
            throw new ArgumentOutOfRangeException(
                nameof(userId),
                "El identificador del usuario debe ser positivo.");
        }

        return userId switch
        {
            1 or 2 => UserRole.Administrador,
            3 => UserRole.Auditor,
            _ => UserRole.Cliente
        };
    }
}
