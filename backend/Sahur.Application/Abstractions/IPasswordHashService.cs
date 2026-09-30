namespace Sahur.Application.Abstractions;

public interface IPasswordHashService
{
    string Hash(string password);
    bool Verify(string passwordHash, string password);
}
