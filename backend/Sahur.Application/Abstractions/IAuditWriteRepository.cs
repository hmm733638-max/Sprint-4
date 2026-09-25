using Sahur.Domain.Entities;
namespace Sahur.Application.Abstractions;
public interface IAuditWriteRepository { Task AddAsync(AuditEntry entry, CancellationToken cancellationToken); }
