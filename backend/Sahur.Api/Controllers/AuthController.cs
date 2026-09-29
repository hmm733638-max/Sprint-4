using Sahur.Application.Auth.Queries.GetCurrentSession;
using Sahur.Application.Auth.Commands.Logout;
using MediatR;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahur.Api.Authentication;
using Sahur.Api.Contracts.Auth;
using Sahur.Application.Auth.Commands.Login;
using Sahur.Application.Auth.Exceptions;

namespace Sahur.Api.Controllers;

[ApiController]
[Route("api/auth")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class AuthController(
    ISender sender,
    IAntiforgery antiforgery) : ControllerBase
{

    [Authorize]
    [HttpGet("session")]
    public async Task<IActionResult> GetSession(
        CancellationToken cancellationToken)
    {
        var user = await sender.Send(
            new GetCurrentSessionQuery(),
            cancellationToken);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "No hay una sesión activa."
            });
        }

        return Ok(user);
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout(
        CancellationToken cancellationToken)
    {
        await sender.Send(new LogoutCommand(), cancellationToken);

        return NoContent();
    }

    [AllowAnonymous]
    [HttpGet("csrf")]
    public IActionResult GetCsrfToken()
    {
        var tokens = antiforgery.GetAndStoreTokens(HttpContext);

        return Ok(new
        {
            requestToken = tokens.RequestToken
        });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var user = await sender.Send(
                new LoginCommand(request.Username, request.Password),
                cancellationToken);

            if (user is null)
            {
                return Unauthorized(new
                {
                    message = "Usuario o contraseña inválidos"
                });
            }

            var principal = UserClaimsFactory.Create(user);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    AllowRefresh = false,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddHours(8)
                });

            return Ok(user);
        }
        catch (AuthenticationProviderException)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                new
                {
                    message = "El servicio de autenticación no está disponible. Inténtalo nuevamente."
                });
        }
    }
}
