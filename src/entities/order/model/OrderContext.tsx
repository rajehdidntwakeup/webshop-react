import {createContext, ReactNode, useCallback, useContext, useState} from 'react';

import {orderApi} from "../api/orderApi";

import {CreateOrderDto} from "./CreateOrderDto";
import {Order} from "./Order";

/**
 * Type definition for the Order context value.
 */
interface OrderContextType {
    /** List of all orders. */
    orders: Order[];
    /** Loading state for order-related operations. */
    isLoading: boolean;
    /** Error message if an operation fails, null otherwise. */
    error: string | null;
    /**
     * Fetches all orders from the API and updates the state.
     * @returns {Promise<void>}
     */
    fetchOrders: () => Promise<void>;
    /**
     * Adds a new order via the API and refreshes the order list.
     * @param {CreateOrderDto} order - The data for the new order.
     * @returns {Promise<void>}
     */
    addOrder: (order: CreateOrderDto) => Promise<void>;
}

/**
 * The OrderContext instance.
 */
const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
 * Provider component that wraps the application and provides order-related state and functions.
 * 
 * @param {Object} props - Component props.
 * @param {ReactNode} [props.children] - Child components to be wrapped.
 * @returns {JSX.Element} The provider component.
 */
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

/**
 * Custom hook to access the Order context.
 * 
 * @throws {Error} If used outside of an OrderProvider.
 * @returns {OrderContextType} The order context value.
 */
export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}
