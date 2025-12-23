

/**
 * Data Transfer Object for an item within an order response.
 */
export interface OrderItemResponseDto {
    /** Unique identifier for the order item */
    orderItemId : string;
    /** Unique identifier for the product */
    productId : string;
    /** Quantity of the product in this order */
    quantity : number;
}