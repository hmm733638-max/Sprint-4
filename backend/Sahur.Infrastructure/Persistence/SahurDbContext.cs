using Microsoft.EntityFrameworkCore;

namespace Sahur.Infrastructure.Persistence;

public sealed class SahurDbContext(DbContextOptions<SahurDbContext> options)
    : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SahurDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
