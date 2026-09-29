using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Sahur.Application.Abstractions;
using Sahur.Application.Auth.Exceptions;
using Sahur.Application.Auth.Models;

namespace Sahur.Infrastructure.ExternalApis.FakeStore;

public sealed class FakeStoreAuthenticationGateway(HttpClient httpClient)
    : IAuthenticationGateway
{
    public async Task<ExternalUserProfile?> AuthenticateAsync(
        string username,
        string password,
        CancellationToken cancellationToken)
    {
        try
        {
            using var loginResponse = await httpClient.PostAsJsonAsync(
                "auth/login",
                new { username, password },
                cancellationToken);

            if (loginResponse.StatusCode == HttpStatusCode.Unauthorized)
            {
                return null;
            }

            loginResponse.EnsureSuccessStatusCode();

            var login = await loginResponse.Content
                .ReadFromJsonAsync<FakeStoreLoginResponseDto>(
                    cancellationToken: cancellationToken);

            if (string.IsNullOrWhiteSpace(login?.Token))
            {
                throw new AuthenticationProviderException(
                    "El proveedor no devolvió un token de autenticación.");
            }

            // Esta consulta ocurre únicamente después de autenticar
            // las credenciales con el proveedor.
            var users = await httpClient
                .GetFromJsonAsync<List<FakeStoreUserDto>>(
                    "users",
                    cancellationToken);

            if (users is null)
            {
                throw new AuthenticationProviderException(
                    "El proveedor no devolvió información de usuarios.");
            }

            var matches = users
                .Where(user => string.Equals(
                    user.Username,
                    username,
                    StringComparison.Ordinal))
                .Take(2)
                .ToArray();

            if (matches.Length != 1)
            {
                throw new AuthenticationProviderException(
                    "No se pudo identificar de forma única al usuario autenticado.");
            }

            var user = matches[0];

            if (user.Id <= 0 || string.IsNullOrWhiteSpace(user.Username))
            {
                throw new AuthenticationProviderException(
                    "El proveedor devolvió un perfil de usuario inválido.");
            }

            return new ExternalUserProfile(
                user.Id,
                user.Username,
                user.Email ?? string.Empty,
                user.Name?.Firstname ?? string.Empty,
                user.Name?.Lastname ?? string.Empty);
        }
        catch (HttpRequestException exception)
        {
            throw new AuthenticationProviderException(
                "No se pudo completar la comunicación con el proveedor de autenticación.",
                exception);
        }
        catch (OperationCanceledException exception)
            when (!cancellationToken.IsCancellationRequested)
        {
            throw new AuthenticationProviderException(
                "El proveedor de autenticación tardó demasiado en responder.",
                exception);
        }
        catch (JsonException exception)
        {
            throw new AuthenticationProviderException(
                "El proveedor de autenticación devolvió una respuesta inválida.",
                exception);
        }
    }
}
