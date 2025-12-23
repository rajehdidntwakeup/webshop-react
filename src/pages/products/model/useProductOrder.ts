import {useState} from 'react';
import {toast} from 'sonner';

import {NewOrderDto} from '@/entities/order/model/CreateOrderDto';
import {useOrders} from '@/entities/order/model/OrderContext';
import {useProducts} from '@/entities/product/model/ProductsContext';

/**
 * Custom hook to manage the product ordering process.
 * It provides functionality to place an order for a single product and tracks which items have been ordered during the session.
 *
 * @returns {object} An object containing the set of ordered item IDs and the handleOrder function.
 * @returns {Set<string>} returns.orderedItems - A set of IDs for items that have been ordered.
 * @returns {Function} returns.handleOrder - A function to initiate an order for a product.
 */
export function useProductOrder() {
    /**
     * Set of product IDs that have been ordered in the current session.
     */
    const [orderedItems, setOrderedItems] = useState<Set<string>>(new Set());

    /**
     * Access to order-related actions.
     */
    const {addOrder} = useOrders();

    /**
     * Access to product data and refresh logic.
     */
    const {products, refreshProducts} = useProducts();

    /**
     * Handles the ordering process for a specific product.
     * It creates a new order, updates the products list, and shows a success/error notification.
     *
     * @param {string} productId - The ID of the product to order.
     * @param {string} productName - The name of the product to order (used for notifications).
     */
    const handleOrder = async (productId: string, productName: string) => {
        const product = products.find(p => p.productId === productId);
        if (!product) return;

        const newOrder: NewOrderDto = {
            productId: productId,
            quantity: 1,
        };


        try {
            await addOrder(newOrder);
            await refreshProducts();

            setOrderedItems(prev => new Set(prev).add(productId));

            toast.success(`${productName} ordered successfully!`, {
                description: 'Your order has been placed.',
                duration: 3000,
            });
        } catch (error) {
            console.error("Failed to order product:", error);
            toast.error(`Failed to order ${productName}`, {
                description: 'Please try again later.',
            });
        }
    };

    return {
        orderedItems,
        handleOrder
    };
}
