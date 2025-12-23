import { ENV } from "@/shared/config/env";

import { NewOrderDto } from "../model/CreateOrderDto";
import { OrderResponseDto } from "../model/Order";

const ORDER_URL = ENV.ORDER_API_URL;

/**
 * API service for managing orders.
 */
export const orderApi = {

    /**
     * Fetches a list of orders.
     * @param externalOrder - Flag to include external orders.
     * @returns A promise that resolves to an array of OrderResponseDto.
     * @throws Error if the fetch request fails.
     */
    async fetchOrders(externalOrder: boolean): Promise<OrderResponseDto[]> {
        const response = await fetch(`${ORDER_URL}?externalOrder=${externalOrder}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        const data: (OrderResponseDto & { id?: string })[] = await response.json();
        return data.map((order): OrderResponseDto => ({
            ...order,
            orderId: order.orderId || order.id || '',
            items: order.items || []
        }));
    },

    /**
     * Adds a new set of orders.
     * @param newOrder - An array of NewOrderDto to be added.
     * @returns A promise that resolves when the orders are successfully added.
     * @throws Error if the add request fails.
     */
    async addOrder(newOrder: NewOrderDto[]): Promise<void> {
        console.log(newOrder);
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
