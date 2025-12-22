import {OrderItem} from "./OrderItem";

/**
 * Data Transfer Object for creating a new order.
 */
export interface CreateOrderDto {
    /**
     * Total price of the order as a formatted string.
     */
    totalPrice: string;
    /**
     * Current status of the order (e.g., 'PENDING', 'COMPLETED').
     */
    status: string;
    /**
     * List of items included in the order.
     */
    items: OrderItem[];
}