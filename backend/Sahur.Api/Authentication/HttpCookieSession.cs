using System.Globalization;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Sahur.Application.Abstractions;
using Sahur.Domain.Entities;
using Sahur.Domain.Enums;

namespace Sahur.Api.Authentication;

public sealed class HttpCookieSession(IHttpContextAccessor accessor)
    : ISessionReader, ISessionWriter
{
    public AuthenticatedUser? GetCurrentUser()
    {
        var principal = GetContext().User;

        if (principal.Identity?.IsAuthenticated != true)
        {
            return null;
        }

        var idValue = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleValue = principal.FindFirst(ClaimTypes.Role)?.Value;
        var username = principal.FindFirst(ClaimTypes.Name)?.Value;

        if (!int.TryParse(
                idValue,
                NumberStyles.None,
                CultureInfo.InvariantCulture,
                out var id)
            || id <= 0
            || string.IsNullOrWhiteSpace(username)
            || !Enum.TryParse<UserRole>(roleValue, out var role)
            || !Enum.IsDefined(role))
        {
            return null;
        }

        return new AuthenticatedUser(
            id,
            username,
            principal.FindFirst(ClaimTypes.Email)?.Value ?? string.Empty,
            principal.FindFirst(ClaimTypes.GivenName)?.Value ?? string.Empty,
            principal.FindFirst(ClaimTypes.Surname)?.Value ?? string.Empty,
            role);
    }

    public async Task SignOutAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var context = GetContext();

        await context.SignOutAsync(
            CookieAuthenticationDefaults.AuthenticationScheme);

        context.Response.Cookies.Delete(
            "sahur.csrf",
            new CookieOptions { Path = "/" });

        context.User = new ClaimsPrincipal(new ClaimsIdentity());
    }

    private HttpContext GetContext()
    {
        return accessor.HttpContext
            ?? throw new InvalidOperationException(
                "No existe una petición HTTP activa.");
    }
}
