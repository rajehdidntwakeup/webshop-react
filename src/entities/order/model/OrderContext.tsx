import {createContext, ReactNode, useCallback, useContext, useState} from 'react';
import {Order} from "./Order";
import {CreateOrderDto} from "./CreateOrderDto";
import {orderApi} from "../api/orderApi";

interface OrderContextType {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    addOrder: (order: CreateOrderDto) => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({children}: { children?: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const mappedOrders = await orderApi.fetchOrders();
            setOrders(mappedOrders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addOrder = useCallback(async (newOrder: CreateOrderDto) => {
        setError(null);
        try {
            await orderApi.addOrder(newOrder);
            await fetchOrders();
        } catch (err) {
            console.error('Error adding order:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        }
    }, [fetchOrders]);


    return (
        <OrderContext.Provider value={{orders, isLoading, error, fetchOrders, addOrder}}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}
