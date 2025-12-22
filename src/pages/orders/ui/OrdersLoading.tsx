import {Loader2} from 'lucide-react';

/**
 * OrdersLoading component displays a loading spinner and message.
 * It is shown while the order data is being fetched.
 *
 * @component
 */
export function OrdersLoading() {
    return (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 text-center">
            <Loader2 className="w-16 h-16 text-white/40 mx-auto mb-4 animate-spin"/>
            <h2 className="text-white">Loading orders...</h2>
        </div>
    );
}
