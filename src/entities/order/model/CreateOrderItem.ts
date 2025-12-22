/**
 * Represents an item within a new order being created.
 */
export interface CreateOrderItem {
    /**
     * Unique identifier for the item.
     */
    itemId: number;
    /**
     * Name of the item.
     */
    itemName: string;
    /**
     * Quantity of the item to be ordered.
     */
    quantity: number;
    /**
     * Price of the item as a formatted string.
     */
    price: string;
}