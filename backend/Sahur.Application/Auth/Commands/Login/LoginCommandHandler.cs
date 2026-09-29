using MediatR;
using Sahur.Application.Abstractions;
using Sahur.Domain.Entities;
using Sahur.Domain.Policies;

namespace Sahur.Application.Auth.Commands.Login;

public sealed class LoginCommandHandler(
    IAuthenticationGateway authenticationGateway)
    : IRequestHandler<LoginCommand, AuthenticatedUser?>
{
    public async Task<AuthenticatedUser?> Handle(
        LoginCommand request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Username)
            || string.IsNullOrEmpty(request.Password))
        {
            return null;
        }

        var externalUser = await authenticationGateway.AuthenticateAsync(
            request.Username.Trim(),
            request.Password,
            cancellationToken);

        if (externalUser is null)
        {
            return null;
        }

        var role = UserRolePolicy.FromUserId(externalUser.Id);

        return new AuthenticatedUser(
            externalUser.Id,
            externalUser.Username,
            externalUser.Email,
            externalUser.FirstName,
            externalUser.LastName,
            role);
    }
}
