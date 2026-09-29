using MediatR;
using Sahur.Application.Abstractions;
using Sahur.Domain.Entities;

namespace Sahur.Application.Auth.Queries.GetCurrentSession;

public sealed class GetCurrentSessionQueryHandler(ISessionReader sessionReader)
    : IRequestHandler<GetCurrentSessionQuery, AuthenticatedUser?>
{
    public Task<AuthenticatedUser?> Handle(
        GetCurrentSessionQuery request,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        return Task.FromResult(sessionReader.GetCurrentUser());
    }
}
