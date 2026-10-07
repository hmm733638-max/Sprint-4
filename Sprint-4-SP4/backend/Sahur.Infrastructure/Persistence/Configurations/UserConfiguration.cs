using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sahur.Domain.Users;

namespace Sahur.Infrastructure.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(user => user.Id);
        builder.Property(user => user.Id).ValueGeneratedNever();
        builder.Property(user => user.Username).IsRequired();
        builder.Property(user => user.NormalizedUsername).IsRequired();
        builder.Property(user => user.PasswordHash).IsRequired();
        builder.Property(user => user.FullName).IsRequired();
        builder.Property(user => user.Email).IsRequired();
        builder.Property(user => user.Phone).IsRequired();
        builder.HasIndex(user => user.NormalizedUsername).IsUnique();
        builder.Ignore(user => user.Role);
    }
}
