import {OrderItemResponseDto} from "./OrderItem";

/** Represents the status of an order */
export type Status = 'NEW' | 'COMPLETED' | 'FAILED';

/** Represents the origin of an order */
export type Origin = 'INTERNAL' | 'EXTERNAL';

/** Data Transfer Object for order response */
export interface OrderResponseDto {
    /** Unique identifier for the order */
    orderId: string;
    /** Date and time when the order was created */
    createdAt: string;
    /** Date and time when the order was last updated */
    updatedAt: string;
    /** Current status of the order */
    status: Status;
    /** Origin of the order (INTERNAL or EXTERNAL) */
    origin: Origin;
    /** List of items included in the order */
    items: OrderItemResponseDto[];
}


/** Simplified order item model for UI display */
export interface OrderItem {
    /** Unique identifier for the order this item belongs to */
    orderId: string;
    /** Name of the product */
    productName: string;
    /** Price of the product at the time of order */
    price: number;
    /** Date and time when the order was created */
    createdAt: string;
    /** Current status of the order */
    status: Status;
}