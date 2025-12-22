/**
 * Represents an item within an order.
 */
export interface OrderItem {
    /**
     * Unique identifier for the order item.
     */
    id: number;
    /**
     * Identifier of the associated item/product.
     */
    itemId: number;
    /**
     * Name of the item at the time of order.
     */
    itemName: string;
    /**
     * Quantity of the item ordered.
     */
    quantity: number;
    /**
     * Price per unit of the item as a string (to preserve precision).
     */
    price: string;
}