/**
 * Data Transfer Object for creating a new order item.
 */
export interface NewOrderDto {
    /** Unique identifier of the product */
    productId: string;
    /** Quantity of the product being ordered */
    quantity: number;
}