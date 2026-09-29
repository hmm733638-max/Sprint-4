namespace Sahur.Infrastructure.ExternalApis.FakeStore;

internal sealed class FakeStoreUserDto
{
    public int Id { get; init; }
    public string? Username { get; init; }
    public string? Email { get; init; }
    public FakeStoreUserNameDto? Name { get; init; }
}

internal sealed class FakeStoreUserNameDto
{
    public string? Firstname { get; init; }
    public string? Lastname { get; init; }
}
