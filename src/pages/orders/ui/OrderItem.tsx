import {Package} from 'lucide-react';
import {Order} from '@/entities/order/model/Order';

/**
 * Props for the OrderItem component.
 *
 * @interface OrderItemProps
 */
interface OrderItemProps {
    /** The order object to display. */
    order: Order;
}

/**
 * OrderItem component renders a single order's details including ID, items, total price, and status.
 *
 * @component
 * @param {OrderItemProps} props - The component props.
 */
export function OrderItem({order}: OrderItemProps) {
    return (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-white/40 text-sm font-mono">#{order.id}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {order.orderItems?.map((item, index) => (
                            <div key={index}>
                                <h3 className="text-white mb-2">{item.itemName}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-xl font-bold text-white">Total Amount</div>
                        <div className="text-xl font-bold text-white">{order.totalPrice} €</div>
                    </div>
                    <div className="backdrop-blur-md bg-green-500/30 border border-green-400/50 text-green-200 px-4 py-2 rounded-xl flex items-center gap-2">
                        <Package className="w-4 h-4"/>
                        <span className="text-sm font-medium">{order.status}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
