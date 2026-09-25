using MediatR;
using Sahur.Application.Abstractions;
using Sahur.Domain.Entities;
namespace Sahur.Application.Audit.Commands.CreateAudit;
public sealed class CreateAuditCommandHandler(IAuditWriteRepository repository) : IRequestHandler<CreateAuditCommand, Guid>
{
    public async Task<Guid> Handle(CreateAuditCommand request, CancellationToken cancellationToken)
    {
        var entry = new AuditEntry(request.Action);
        await repository.AddAsync(entry, cancellationToken);
        return entry.Id;
    }
}
