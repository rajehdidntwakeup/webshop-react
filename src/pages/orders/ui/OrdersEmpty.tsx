import {ShoppingBag} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

/**
 * OrdersEmpty component is displayed when there are no orders to show.
 * It provides a call-to-action button to navigate back to the product catalog.
 *
 * @component
 */
export function OrdersEmpty() {
    /**
     * Hook to handle programmatic navigation.
     */
    const navigate = useNavigate();

    return (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-white/40 mx-auto mb-4"/>
            <h2 className="text-white mb-2">No orders yet</h2>
            <p className="text-white/70 mb-6">Start shopping to see your orders here</p>
            <button
                onClick={() => navigate('/products')}
                className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
                Browse Products
            </button>
        </div>
    );
}
