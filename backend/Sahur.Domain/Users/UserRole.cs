namespace Sahur.Domain.Users;

public enum UserRole
{
    Cliente,
    Administrador,
    Auditor
}

public static class UserRolePolicy
{
    public static UserRole FromUserId(int id) => id switch
    {
        1 or 2 => UserRole.Administrador,
        3 => UserRole.Auditor,
        > 0 => UserRole.Cliente,
        _ => throw new ArgumentOutOfRangeException(nameof(id))
    };
}
