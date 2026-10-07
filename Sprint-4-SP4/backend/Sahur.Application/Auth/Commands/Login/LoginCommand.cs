using Sahur.Application.Messaging;

namespace Sahur.Application.Auth.Commands.Login;

public sealed record LoginCommand(string Username, string Password) : ICommand<LoginResult?>;

public sealed record LoginResult(
    string AccessToken,
    string TokenType,
    DateTimeOffset ExpiresAt,
    AuthenticatedUserReadModel User);
