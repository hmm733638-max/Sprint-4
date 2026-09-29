using MediatR;
using Sahur.Domain.Entities;

namespace Sahur.Application.Auth.Commands.Login;

public sealed class LoginCommand(
    string username,
    string password) : IRequest<AuthenticatedUser?>
{
    public string Username { get; } = username;
    public string Password { get; } = password;
}
