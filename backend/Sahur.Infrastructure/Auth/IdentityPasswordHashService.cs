using Microsoft.AspNetCore.Identity;
using Sahur.Application.Abstractions;

namespace Sahur.Infrastructure.Auth;

public sealed class IdentityPasswordHashService : IPasswordHashService
{
    private readonly PasswordHasher<object> hasher = new();
    private readonly object context = new();

    public string Hash(string password) => hasher.HashPassword(context, password);

    public bool Verify(string passwordHash, string password)
    {
        try
        {
            return hasher.VerifyHashedPassword(context, passwordHash, password)
                != PasswordVerificationResult.Failed;
        }
        catch (FormatException)
        {
            return false;
        }
    }
}
