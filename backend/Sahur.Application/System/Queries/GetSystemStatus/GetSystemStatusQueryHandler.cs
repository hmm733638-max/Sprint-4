using Sahur.Application.Abstractions;
using Sahur.Application.Messaging;

namespace Sahur.Application.System.Queries.GetSystemStatus;

public sealed class GetSystemStatusQueryHandler(
    ISystemStatusReadRepository repository)
    : IQueryHandler<GetSystemStatusQuery, SystemStatusReadModel>
{
    public Task<SystemStatusReadModel> Handle(
        GetSystemStatusQuery request,
        CancellationToken cancellationToken) =>
        repository.GetAsync(cancellationToken);
}
