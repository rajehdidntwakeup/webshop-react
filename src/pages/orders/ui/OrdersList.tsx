import {Order} from '@/entities/order/model/Order';
import {OrderItem} from './OrderItem';

/**
 * Props for the OrdersList component.
 *
 * @interface OrdersListProps
 */
interface OrdersListProps {
    /** The list of orders to display. */
    orders: Order[];
}

/**
 * OrdersList component renders a grid of OrderItem components.
 *
 * @component
 * @param {OrdersListProps} props - The component props.
 */
export function OrdersList({orders}: OrdersListProps) {
    return (
        <div className="grid gap-4">
            {orders.map((order) => (
                <OrderItem key={order.id} order={order}/>
            ))}
        </div>
    );
}
