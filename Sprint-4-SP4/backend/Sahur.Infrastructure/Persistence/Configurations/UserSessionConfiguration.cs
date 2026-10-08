using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sahur.Domain.Auth;
using Sahur.Domain.Users;

namespace Sahur.Infrastructure.Persistence.Configurations;

public sealed class UserSessionConfiguration : IEntityTypeConfiguration<UserSession>
{
    public void Configure(EntityTypeBuilder<UserSession> builder)
    {
        builder.HasKey(session => session.TokenHash);
        builder.Property(session => session.TokenHash).ValueGeneratedNever();
        builder.HasOne<User>().WithMany().HasForeignKey(session => session.UserId);
    }
}
