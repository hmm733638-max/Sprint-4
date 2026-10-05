namespace Sahur.Domain.Cart;

public sealed class Cart
{
    private readonly List<CartItem> items = [];

    public IReadOnlyCollection<CartItem> Items => items.AsReadOnly();

    public void AddItem(int productId, int quantity)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(productId);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);

        CartItem? existingItem = items
            .FirstOrDefault(item => item.ProductId == productId);

        if (existingItem is not null)
        {
            existingItem.AddQuantity(quantity);
            return;
        }

        CartItem newItem = new(productId, quantity);
        items.Add(newItem);
    }
}