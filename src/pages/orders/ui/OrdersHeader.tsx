import {ArrowLeft, Package} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

/**
 * Props for the OrdersHeader component.
 *
 * @interface OrdersHeaderProps
 */
interface OrdersHeaderProps {
    /** The total number of orders. */
    ordersCount: number;
}

/**
 * OrdersHeader component displays the page title and the total number of orders.
 * It also includes a back button to navigate to the home page.
 *
 * @component
 * @param {OrdersHeaderProps} props - The component props.
 */
export function OrdersHeader({ordersCount}: OrdersHeaderProps) {
    /**
     * Hook to handle programmatic navigation.
     */
    const navigate = useNavigate();

    return (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8">
            <button
                onClick={() => navigate('/')}
                className="group flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/>
                Back to Home
            </button>

            <div className="flex items-center gap-4 mb-4">
                <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-3">
                    <Package className="w-8 h-8 text-white"/>
                </div>
                <h1 className="text-white">Your Orders</h1>
            </div>

            <p className="text-white/80">
                View all your placed orders below. Total orders: {ordersCount}
            </p>
        </div>
    );
}
