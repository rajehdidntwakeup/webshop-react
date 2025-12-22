import { ENV } from "@/shared/config/env";
import { Order } from "../model/Order";
import { CreateOrderDto } from "../model/CreateOrderDto";

const ORDER_URL = ENV.ORDER_API_URL;

/**
 * API service for managing orders.
 */
export const orderApi = {
    /**
     * Fetches all orders from the server.
     * 
     * @returns {Promise<Order[]>} A promise that resolves to an array of orders.
     * @throws {Error} If the network request fails or the server returns a non-ok status.
     */
    async fetchOrders(): Promise<Order[]> {
        const response = await fetch(`${ORDER_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        return data.map((order: Order): Order => ({
            ...order,
            orderItems: order.orderItems || []
        }));
    },

    /**
     * Creates a new order.
     * 
     * @param {CreateOrderDto} newOrder - The order data to be created.
     * @returns {Promise<void>} A promise that resolves when the order is successfully created.
     * @throws {Error} If the network request fails or the server returns a non-ok status.
     */
    async addOrder(newOrder: CreateOrderDto): Promise<void> {
        const response = await fetch(`${ORDER_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOrder)
        });
        if (!response.ok) {
            throw new Error('Failed to add order');
        }
    }
};
