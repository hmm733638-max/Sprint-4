using MediatR;
namespace Sahur.Application.Audit.Commands.CreateAudit;
public sealed record CreateAuditCommand(string Action) : IRequest<Guid>;
