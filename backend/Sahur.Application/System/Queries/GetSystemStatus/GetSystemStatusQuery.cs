using Sahur.Application.Messaging;

namespace Sahur.Application.System.Queries.GetSystemStatus;

public sealed record GetSystemStatusQuery : IQuery<SystemStatusReadModel>;

public sealed record SystemStatusReadModel(
    string Application,
    string Persistence,
    bool DatabaseAvailable);
