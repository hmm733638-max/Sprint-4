namespace Sahur.Application.Auth.Exceptions;

public sealed class AuthenticationProviderException : Exception
{
    public AuthenticationProviderException(string message)
        : base(message)
    {
    }

    public AuthenticationProviderException(
        string message,
        Exception innerException)
        : base(message, innerException)
    {
    }
}
