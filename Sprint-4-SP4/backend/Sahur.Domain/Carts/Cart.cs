namespace Sahur.Domain.Carts;

public sealed class Cart
{
    private readonly List<CartItem> items = [];
    private Cart() { }

    public Cart(int id, int userId, DateOnly createdOn, IEnumerable<CartItem> items)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(userId);
        ArgumentNullException.ThrowIfNull(items);

        var cartItems = items.ToArray();
        if (cartItems.Length == 0)
            throw new ArgumentException("Un carrito debe tener al menos un artículo.", nameof(items));

        Id = id;
        UserId = userId;
        CreatedOn = createdOn;
        this.items.AddRange(cartItems);
    }

    public int Id { get; private set; }
    public int UserId { get; private set; }
    public DateOnly CreatedOn { get; private set; }
    public IReadOnlyCollection<CartItem> Items => items.AsReadOnly();
}
