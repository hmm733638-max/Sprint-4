namespace Sahur.Application.Abstractions;

public interface IAccessTokenService
{
    string Create();
    string Hash(string token);
}
