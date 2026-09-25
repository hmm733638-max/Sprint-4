using Microsoft.EntityFrameworkCore;
using Sahur.Domain.Entities;
namespace Sahur.Infrastructure.Persistence;
public sealed class SahurDbContext(DbContextOptions<SahurDbContext> options) : DbContext(options)
{
    public DbSet<AuditEntry> AuditEntries => Set<AuditEntry>();
}
