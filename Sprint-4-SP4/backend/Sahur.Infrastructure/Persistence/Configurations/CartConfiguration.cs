using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sahur.Domain.Carts;

namespace Sahur.Infrastructure.Persistence.Configurations;

public sealed class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.HasKey(cart => cart.Id);
        builder.Property(cart => cart.Id).ValueGeneratedNever();
        builder.Property(cart => cart.UserId).IsRequired();
        builder.Property(cart => cart.CreatedOn).IsRequired();
        builder.HasMany(cart => cart.Items).WithOne().HasForeignKey(item => item.CartId).OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(cart => cart.Items).HasField("items").UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
