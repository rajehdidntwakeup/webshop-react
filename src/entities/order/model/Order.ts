import {OrderItem} from "./OrderItem";

/**
 * Represents an order in the system.
 */
export interface Order {
    /**
     * Unique identifier for the order.
     */
    id: number;
    /**
     * Total price of the order as a formatted string.
     */
    totalPrice: string;
    /**
     * TODO
     * Current status of the order (e.g., 'PENDING', 'COMPLETED').
     */
    status: string;
    /**
     * List of items associated with this order.
     */
    orderItems: OrderItem[];
}