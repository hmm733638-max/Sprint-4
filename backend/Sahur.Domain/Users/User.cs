namespace Sahur.Domain.Users;

public sealed class User
{
    private User() { }

    public User(int id, string username, string passwordHash)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id);
        ArgumentException.ThrowIfNullOrWhiteSpace(username);
        ArgumentException.ThrowIfNullOrWhiteSpace(passwordHash);
        Id = id;
        Username = username.Trim();
        NormalizedUsername = NormalizeUsername(username);
        PasswordHash = passwordHash;
    }

    public int Id { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string NormalizedUsername { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public UserRole Role => UserRolePolicy.FromUserId(Id);

    public static string NormalizeUsername(string username) => username.Trim().ToUpperInvariant();
}
