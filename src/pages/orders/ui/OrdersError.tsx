import {Package} from 'lucide-react';

interface OrdersErrorProps {
    error: string;
    onRetry: () => void;
}

export function OrdersError({error, onRetry}: OrdersErrorProps) {
    return (
        <div className="backdrop-blur-xl bg-white/10 border border-red-500/20 rounded-3xl p-12 text-center">
            <Package className="w-16 h-16 text-red-400/40 mx-auto mb-4"/>
            <h2 className="text-white mb-2">Failed to load orders</h2>
            <p className="text-red-200/70 mb-6">{error}</p>
            <button
                onClick={onRetry}
                className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white px-6 py-3 rounded-xl transition-all duration-300"
            >
                Try Again
            </button>
        </div>
    );
}
