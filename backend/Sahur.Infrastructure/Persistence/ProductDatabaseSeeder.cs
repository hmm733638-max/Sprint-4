using Microsoft.EntityFrameworkCore;
using Sahur.Domain.Products;

namespace Sahur.Infrastructure.Persistence;

public sealed class ProductDatabaseSeeder(SahurDbContext dbContext)
{
    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await dbContext.Products.AnyAsync(cancellationToken))
            return;

        Product[] products =
        [
            new(1, "Audífonos Nova", 899.00m, "Audífonos circumaurales con micrófono y controles integrados para sesiones de estudio y trabajo.", "Electrónica", "/product-images/electronica.svg"),
            new(2, "Teclado Mecánico TKL", 1299.00m, "Teclado compacto con distribución TKL, switches mecánicos y conexión USB.", "Electrónica", "/product-images/electronica.svg"),
            new(3, "Mouse Óptico Pro", 549.00m, "Mouse ergonómico con sensor óptico de precisión y botones laterales configurables.", "Electrónica", "/product-images/electronica.svg"),
            new(4, "Mochila Urbana 20L", 749.00m, "Mochila ligera con compartimento acolchado para laptop y bolsillos de organización.", "Accesorios", "/product-images/accesorios.svg"),
            new(5, "Termo Acero 750ml", 389.00m, "Termo reutilizable de acero inoxidable con tapa hermética y acabado mate.", "Accesorios", "/product-images/accesorios.svg"),
            new(6, "Soporte Ajustable Laptop", 629.00m, "Base ajustable para computadora portátil con estructura ventilada y antideslizante.", "Accesorios", "/product-images/accesorios.svg"),
            new(7, "Sudadera SAHUR", 699.00m, "Sudadera unisex de algodón con corte regular, bolsillo frontal y capucha.", "Ropa", "/product-images/ropa.svg"),
            new(8, "Playera Básica", 299.00m, "Playera de algodón de uso diario con cuello redondo y acabado suave.", "Ropa", "/product-images/ropa.svg"),
            new(9, "Gorra Clásica", 279.00m, "Gorra ajustable de seis paneles con visera curva y bordado frontal.", "Ropa", "/product-images/ropa.svg"),
            new(10, "Libreta Técnica", 159.00m, "Libreta de pasta dura con hojas cuadriculadas para diagramas, notas y ejercicios.", "Papelería", "/product-images/papeleria.svg"),
            new(11, "Set de Marcadores", 219.00m, "Juego de marcadores de punta fina para esquemas, apuntes y organización visual.", "Papelería", "/product-images/papeleria.svg"),
            new(12, "Organizador de Escritorio", 329.00m, "Organizador modular para útiles, cables y accesorios de escritorio.", "Papelería", "/product-images/papeleria.svg")
        ];

        await dbContext.Products.AddRangeAsync(products, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
