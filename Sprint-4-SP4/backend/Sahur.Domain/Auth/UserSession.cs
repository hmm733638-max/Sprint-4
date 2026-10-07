namespace Sahur.Domain.Auth;

public sealed class UserSession
{
    private UserSession() { }

    public UserSession(string tokenHash, int userId, DateTimeOffset expiresAt)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(tokenHash);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(userId);
        TokenHash = tokenHash;
        UserId = userId;
        ExpiresAt = expiresAt;
    }

    public string TokenHash { get; private set; } = string.Empty;
    public int UserId { get; private set; }
    public DateTimeOffset ExpiresAt { get; private set; }

    public bool IsExpired(DateTimeOffset now) => now >= ExpiresAt;
}
