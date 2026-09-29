using Sahur.Application.Auth.Models;

namespace Sahur.Application.Abstractions;

public interface IAuthenticationGateway
{
    // Retorna null cuando las credenciales son incorrectas.
    // Los fallos de conexión se comunicarán mediante excepciones.
    Task<ExternalUserProfile?> AuthenticateAsync(
        string username,
        string password,
        CancellationToken cancellationToken);
}
