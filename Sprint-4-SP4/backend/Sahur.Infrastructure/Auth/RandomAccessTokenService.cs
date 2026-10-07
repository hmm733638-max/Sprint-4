using System.Security.Cryptography;
using System.Text;
using Sahur.Application.Abstractions;

namespace Sahur.Infrastructure.Auth;

public sealed class RandomAccessTokenService : IAccessTokenService
{
    public string Create() => Convert.ToHexString(RandomNumberGenerator.GetBytes(32));

    public string Hash(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
}
