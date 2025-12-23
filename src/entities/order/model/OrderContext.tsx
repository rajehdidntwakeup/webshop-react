import {createContext, ReactNode, useCallback, useContext, useState} from 'react';

import {productApi} from "../../product/api/productApi";
import {ProductResponseDto} from "../../product/model/Product";
import {orderApi} from "../api/orderApi";

import {NewOrderDto} from "./CreateOrderDto";
import {OrderItem, OrderResponseDto} from "./Order";

/**
 * Type definition for the Order context value.
 */
interface OrderContextType {
    /** List of all orders. */
    orders: OrderItem[];
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
     * @param {NewOrderDto} order - The data for the new order.
     * @returns {Promise<void>}
     */
    addOrder: (order: NewOrderDto) => Promise<void>;
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
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetches all orders from the API and updates the state.
     * It also fetches product details for each order to display product names and prices.
     * Uses a cache to avoid redundant product API calls.
     * @returns {Promise<void>}
     */
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const mappedOrders: OrderResponseDto[] = await orderApi.fetchOrders(false);

            const productCache = new Map<string, Promise<ProductResponseDto>>();

            const orderItemsPromises = mappedOrders.map(async (order) => {
                try {
                    const productId = order.items[0]?.productId;
                    if (!productId) {
                        return {
                            orderId: order.orderId,
                            productName: 'Unknown Product',
                            price: 0,
                            createdAt: order.createdAt,
                            status: order.status,
                        };
                    }

                    let productPromise = productCache.get(productId);
                    if (!productPromise) {
                        productPromise = productApi.getProductById(productId);
                        productCache.set(productId, productPromise);
                    }

                    const product = await productPromise;

                    return {
                        orderId: order.orderId,
                        productName: product.name,
                        price: product.price,
                        createdAt: order.createdAt,
                        status: order.status,
                    };
                } catch (err) {
                    console.error(`Error fetching product for order ${order.orderId}:`, err);
                    return {
                        orderId: order.orderId,
                        productName: 'Error loading product',
                        price: 0,
                        createdAt: order.createdAt,
                        status: order.status,
                    };
                }
            });

            const orderItems = await Promise.all(orderItemsPromises);
            setOrders(orderItems);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);


    /**
     * Adds a new order via the API and refreshes the order list.
     * @param {NewOrderDto} newOrder - The data for the new order.
     * @returns {Promise<void>}
     */
    const addOrder = useCallback(async (newOrder: NewOrderDto) => {
        setError(null);
        try {
            await orderApi.addOrder([newOrder]);
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
