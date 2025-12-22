import {OrderItem} from "./OrderItem";

export interface Order {
    id: number;
    totalPrice: string;
    status: string;
    orderItems: OrderItem[];
}