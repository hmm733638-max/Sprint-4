using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sahur.Domain.Products;

namespace Sahur.Infrastructure.Persistence.Configurations;

public sealed class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(product => product.Id);
        builder.Property(product => product.Id).ValueGeneratedOnAdd();
        builder.Property(product => product.Title).HasMaxLength(180).IsRequired();
        builder.Property(product => product.Price).IsRequired();
        builder.Property(product => product.Description).HasMaxLength(1200).IsRequired();
        builder.Property(product => product.Category).HasMaxLength(80).IsRequired();
        builder.Property(product => product.ImageUrl).HasMaxLength(240).IsRequired();
        builder.HasIndex(product => product.Category);
    }
}
