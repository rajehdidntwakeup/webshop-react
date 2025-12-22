import {useOrders} from '@/entities/order/model/OrderContext';
import {useEffect} from "react";
import {OrdersHeader} from "./ui/OrdersHeader";
import {OrdersLoading} from "./ui/OrdersLoading";
import {OrdersError} from "./ui/OrdersError";
import {OrdersEmpty} from "./ui/OrdersEmpty";
import {OrdersList} from "./ui/OrdersList";
import {AnimatedBackground} from "./ui/AnimatedBackground";

export function OrdersPage() {
    const {orders, fetchOrders, isLoading, error} = useOrders();

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
