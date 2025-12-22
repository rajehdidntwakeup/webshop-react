import {OrderItem} from "@/app/features/order/Order";

export interface CreateOrderDto {
    totalPrice: string;
    status: string;
    items: OrderItem[];
}