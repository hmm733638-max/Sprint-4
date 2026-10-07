namespace Sahur.Domain.Users;

public sealed class User
{
    private User() { }

    public User(int id, string username, string passwordHash, string? fullName = null, string? email = null, string? phone = null)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id);
        ArgumentException.ThrowIfNullOrWhiteSpace(username);
        ArgumentException.ThrowIfNullOrWhiteSpace(passwordHash);
        Id = id;
        Username = username.Trim();
        NormalizedUsername = NormalizeUsername(username);
        PasswordHash = passwordHash;
        FullName = string.IsNullOrWhiteSpace(fullName) ? username.Trim() : fullName.Trim();
        Email = string.IsNullOrWhiteSpace(email) ? $"{Username}@sahur.local" : email.Trim();
        Phone = string.IsNullOrWhiteSpace(phone) ? $"+52 55 0000 {id:0000}" : phone.Trim();
    }

    public int Id { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string NormalizedUsername { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string FullName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public UserRole Role => UserRolePolicy.FromUserId(Id);

    public static string NormalizeUsername(string username) => username.Trim().ToUpperInvariant();
}
