import {useState} from 'react';
import {toast} from 'sonner';
import {useOrders} from '@/entities/order/model/OrderContext';
import {useProducts} from '@/entities/product/model/ProductsContext';
import {CreateOrderDto} from '@/entities/order/model/CreateOrderDto';
import {CreateOrderItem} from '@/entities/order/model/CreateOrderItem';

export function useProductOrder() {
    const [orderedItems, setOrderedItems] = useState<Set<number>>(new Set());
    const {addOrder} = useOrders();
    const {products, refreshProducts} = useProducts();

    const handleOrder = async (productId: number, productName: string) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const newOrderItem: CreateOrderItem = {
            itemId: productId,
            itemName: productName,
            quantity: 1,
            price: product.price
        } as const;

        const newOrder: CreateOrderDto = {
            totalPrice: product.price,
            status: 'CONFIRMED',
            items: [newOrderItem]
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
