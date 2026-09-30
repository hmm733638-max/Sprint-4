namespace Sahur.Infrastructure.Persistence;

public sealed class SeedUserOptions
{
    public Dictionary<int, SeedUser> Users { get; set; } = [];
}

public sealed class SeedUser
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
