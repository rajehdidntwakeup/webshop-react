import {Check, ShoppingBag} from 'lucide-react';

import {ProductResponseDto} from '@/entities/product/model/Product';

/**
 * Props for the ProductCard component.
 *
 * @interface ProductCardProps
 * @property {ProductResponseDto} product - The product object to display.
 * @property {boolean} isOrdered - Whether the product has already been ordered in the current session.
 * @property {Function} onOrder - Callback function to initiate an order for this product.
 */
interface ProductCardProps {
    product: ProductResponseDto;
    isOrdered: boolean;
    onOrder: (productId: string, productName: string) => void;
}

/**
 * ProductCard component displays detailed information about a single product.
 * It shows the product name, description, price, and current stock.
 * Users can place an order directly from the card unless it is out of stock or already ordered.
 *
 * @component
 * @param {ProductCardProps} props - The component props.
 * @returns {JSX.Element} The rendered product card.
 */
export function ProductCard({product, isOrdered, onOrder}: ProductCardProps) {
    /**
     * Flag indicating if the product is currently unavailable due to zero stock.
     */
    const isOutOfStock = product.quantity === 0;

    return (
        <div
            className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
            <div className="p-6">
                <div
                    className={`backdrop-blur-md border px-3 py-1 rounded-full w-fit mb-4 ${
                        isOutOfStock
                            ? 'bg-red-500/30 border-red-400/50'
                            : 'bg-blue-500/30 border-blue-400/50'
                    }`}>
                    <span className={isOutOfStock ? 'text-red-200 text-sm' : 'text-blue-100 text-sm'}>
                        Stock: {product.quantity}
                    </span>
                </div>

                <h3 className="text-white mb-2">{product.name}</h3>

                <p className="text-white/70 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-white">{product.price} €</span>
                </div>

                <button
                    onClick={() => onOrder(product.productId, product.name)}
                    disabled={isOrdered || isOutOfStock}
                    className={`w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        isOrdered
                            ? 'backdrop-blur-md bg-green-500/30 border border-green-400/50 text-green-200 cursor-not-allowed'
                            : isOutOfStock
                                ? 'backdrop-blur-md bg-gray-500/30 border border-gray-400/50 text-gray-400 cursor-not-allowed'
                                : 'backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white hover:scale-105'
                    }`}
                >
                    {isOrdered ? (
                        <>
                            <Check className="w-5 h-5"/>
                            Ordered
                        </>
                    ) : isOutOfStock ? (
                        <>
                            <ShoppingBag className="w-5 h-5"/>
                            Out of Stock
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-5 h-5"/>
                            Order Now
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
