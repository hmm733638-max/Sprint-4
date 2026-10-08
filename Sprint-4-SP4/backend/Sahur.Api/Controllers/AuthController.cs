using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahur.Api.Contracts;
using Sahur.Application.Auth;
using Sahur.Application.Auth.Commands.Login;
using Sahur.Application.Auth.Queries.GetCurrentUser;

namespace Sahur.Api.Controllers;

[ApiController]
[Route("api/auth")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class AuthController(ISender sender) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResult>> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await sender.Send(new LoginCommand(request.Username, request.Password), cancellationToken);
        return result is null
            ? Unauthorized(new { message = "Usuario o contraseña inválidos" })
            : Ok(result);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<AuthenticatedUserReadModel>> Me(CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            return Unauthorized();

        var user = await sender.Send(new GetCurrentUserQuery(userId), cancellationToken);
        return user is null ? Unauthorized() : Ok(user);
    }
}
