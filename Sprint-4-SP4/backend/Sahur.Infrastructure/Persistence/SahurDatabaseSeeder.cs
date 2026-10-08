using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sahur.Application.Abstractions;
using Sahur.Domain.Users;

namespace Sahur.Infrastructure.Persistence;

public sealed class SahurDatabaseSeeder(
    SahurDbContext dbContext,
    IPasswordHashService passwords,
    IOptions<SeedUserOptions> options,
    ILogger<SahurDatabaseSeeder> logger)
{
    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var seeds = options.Value.Users;
        if (seeds.Count == 0)
        {
            logger.LogWarning("No hay usuarios configurados. Ejecuta scripts/configure-users.py y reinicia la API.");
            return;
        }

        if (seeds.Any(seed => seed.Key <= 0 || string.IsNullOrWhiteSpace(seed.Value.Username)
            || string.IsNullOrWhiteSpace(seed.Value.Password)))
            throw new InvalidOperationException("Cada usuario inicial requiere un ID positivo, usuario y contraseña.");

        // InMemory no aplica índices únicos; la carga debe validar la misma regla.
        if (seeds.Values.Select(seed => User.NormalizeUsername(seed.Username)).Distinct().Count() != seeds.Count)
            throw new InvalidOperationException("Los nombres de los usuarios iniciales no pueden repetirse.");

        var existing = await dbContext.Users.AsNoTracking().ToListAsync(cancellationToken);
        foreach (var (id, seed) in seeds)
        {
            if (existing.Any(user => user.Id == id))
                continue;

            if (existing.Any(user => user.NormalizedUsername == User.NormalizeUsername(seed.Username)))
                throw new InvalidOperationException("Un nombre de usuario inicial ya pertenece a otro ID.");

            await dbContext.Users.AddAsync(new User(
                id,
                seed.Username,
                passwords.Hash(seed.Password),
                seed.FullName,
                seed.Email,
                seed.Phone), cancellationToken);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
