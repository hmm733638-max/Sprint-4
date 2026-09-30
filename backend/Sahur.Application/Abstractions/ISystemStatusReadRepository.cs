using Sahur.Application.System.Queries.GetSystemStatus;

namespace Sahur.Application.Abstractions;

public interface ISystemStatusReadRepository
{
    Task<SystemStatusReadModel> GetAsync(CancellationToken cancellationToken);
}
