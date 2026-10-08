namespace Sahur.Domain.Cart;

public sealed class CartItem
{
    private CartItem() { }

    public CartItem(int productId, int quantity)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(productId);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity);

        ProductId = productId;
        Quantity = quantity;
    }

    public int ProductId { get; private set; }

    public int Quantity { get; private set; }

    public void AddQuantity(int additionalQuantity)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(additionalQuantity);

        Quantity += additionalQuantity;
    }
}