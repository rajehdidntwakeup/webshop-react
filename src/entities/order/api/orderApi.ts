import { ENV } from "@/shared/config/env";
import { Order } from "../model/Order";
import { CreateOrderDto } from "../model/CreateOrderDto";

const ORDER_URL = ENV.ORDER_API_URL;

export const orderApi = {
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
            items: order.items || []
        }));
    },

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
