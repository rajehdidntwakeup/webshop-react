import {useEffect} from "react";

import {useOrders} from '@/entities/order/model/OrderContext';

import {AnimatedBackground} from "./ui/AnimatedBackground";
import {OrdersEmpty} from "./ui/OrdersEmpty";
import {OrdersError} from "./ui/OrdersError";
import {OrdersHeader} from "./ui/OrdersHeader";
import {OrdersList} from "./ui/OrdersList";
import {OrdersLoading} from "./ui/OrdersLoading";

/**
 * OrdersPage component displays a list of all customer orders.
 * It manages the order fetching lifecycle and handles different UI states:
 * loading, error, empty, and data display.
 *
 * @component
 */
export function OrdersPage() {
    /**
     * Retrieves order data and control functions from the OrderContext.
     */
    const {orders, fetchOrders, isLoading, error} = useOrders();

    /**
     * Fetches orders on component mount.
     */
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className="relative min-h-screen px-4 py-12">
            <AnimatedBackground/>

            <div className="relative max-w-7xl mx-auto">
                <OrdersHeader ordersCount={orders.length}/>

                {isLoading ? (
                    <OrdersLoading/>
                ) : error ? (
                    <OrdersError error={error} onRetry={fetchOrders}/>
                ) : orders.length === 0 ? (
                    <OrdersEmpty/>
                ) : (
                    <OrdersList orders={orders}/>
                )}
            </div>
        </div>
    );
}
