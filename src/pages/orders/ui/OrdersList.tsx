import {Order} from '@/entities/order/model/Order';
import {OrderItem} from './OrderItem';

interface OrdersListProps {
    orders: Order[];
}

export function OrdersList({orders}: OrdersListProps) {
    return (
        <div className="grid gap-4">
            {orders.map((order) => (
                <OrderItem key={order.id} order={order}/>
            ))}
        </div>
    );
}
