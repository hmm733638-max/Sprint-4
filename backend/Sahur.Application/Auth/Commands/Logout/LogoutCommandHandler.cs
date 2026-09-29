using MediatR;
using Sahur.Application.Abstractions;

namespace Sahur.Application.Auth.Commands.Logout;

public sealed class LogoutCommandHandler(ISessionWriter sessionWriter)
    : IRequestHandler<LogoutCommand>
{
    public Task Handle(
        LogoutCommand request,
        CancellationToken cancellationToken)
    {
        return sessionWriter.SignOutAsync(cancellationToken);
    }
}
