using System.ComponentModel.DataAnnotations;

namespace Sahur.Api.Contracts.Auth;

public sealed class LoginRequest
{
    [Required(ErrorMessage = "El usuario es obligatorio.")]
    public string Username { get; init; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    public string Password { get; init; } = string.Empty;
}
