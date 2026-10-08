using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;
using Sahur.Domain.Auth;

namespace Sahur.Application.Auth.Commands.Login;

public sealed class LoginCommandHandler(
    IUserReadRepository users,
    IPasswordHashService passwords,
    IAccessTokenService tokens,
    IUserSessionWriteRepository sessions,
    IUnitOfWork unitOfWork,
    TimeProvider clock) : ICommandHandler<LoginCommand, LoginResult?>
{
    public async Task<LoginResult?> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return null;

        var user = await users.GetByUsernameAsync(request.Username, cancellationToken);
        if (user is null || !passwords.Verify(user.PasswordHash, request.Password))
            return null;

        var token = tokens.Create();
        var expiresAt = clock.GetUtcNow().AddHours(1);
        await sessions.AddAsync(new UserSession(tokens.Hash(token), user.Id, expiresAt), cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new LoginResult(token, "Bearer", expiresAt, AuthenticatedUserReadModel.FromUser(user));
    }
}
