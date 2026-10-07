namespace Sahur.Domain.Products;

public sealed class Product
{
    private Product() { }

    private Product(
        string title,
        decimal price,
        string description,
        string category,
        string imageUrl)
    {
        ImageUrl = Require(imageUrl, nameof(imageUrl));
        Update(title, price, description, category);
    }

    public Product(
        int id,
        string title,
        decimal price,
        string description,
        string category,
        string imageUrl)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id);
        Id = id;
        ImageUrl = Require(imageUrl, nameof(imageUrl));
        Update(title, price, description, category);
    }

    public static Product Create(
        string title,
        decimal price,
        string description,
        string category,
        string imageUrl) => new(title, price, description, category, imageUrl);

    public int Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public string ImageUrl { get; private set; } = string.Empty;

    public void Update(string title, decimal price, string description, string category)
    {
        if (price <= 0)
            throw new ArgumentOutOfRangeException(nameof(price), "El precio debe ser mayor que cero.");

        Title = Require(title, nameof(title));
        Price = decimal.Round(price, 2, MidpointRounding.AwayFromZero);
        Description = Require(description, nameof(description));
        Category = Require(category, nameof(category));
    }

    private static string Require(string value, string parameterName)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value, parameterName);
        return value.Trim();
    }
}
