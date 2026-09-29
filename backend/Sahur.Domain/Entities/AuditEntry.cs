namespace Sahur.Domain.Entities;

public sealed class AuditEntry
{
    private AuditEntry() { }
    public AuditEntry(string action)
    {
        if (string.IsNullOrWhiteSpace(action)) throw new ArgumentException("Action is required.", nameof(action));
        Id = Guid.NewGuid();
        Action = action.Trim();
        CreatedAtUtc = DateTime.UtcNow;
    }
    public Guid Id { get; private set; }
    public string Action { get; private set; } = string.Empty;
    public DateTime CreatedAtUtc { get; private set; }
}
