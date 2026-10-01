using Microsoft.EntityFrameworkCore;
using Sahur.Domain.Auth;
using Sahur.Domain.Products;
using Sahur.Domain.Users;

namespace Sahur.Infrastructure.Persistence;

public sealed class SahurDbContext(DbContextOptions<SahurDbContext> options)
    : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<UserSession> UserSessions => Set<UserSession>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SahurDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
