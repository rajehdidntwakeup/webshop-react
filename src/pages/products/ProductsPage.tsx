import {ArrowLeft, Check, ShoppingBag} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {toast} from 'sonner';
import {useOrders} from '@/entities/order/model/OrderContext';
import {useProducts} from '@/entities/product/model/ProductsContext';
import {CreateOrderDto} from "@/entities/order/model/CreateOrderDto"
import {CreateOrderItem} from "@/entities/order/model/CreateOrderItem"

export function ProductsPage() {
    const navigate = useNavigate();
    const [orderedItems, setOrderedItems] = useState<Set<number>>(new Set());
    const {addOrder} = useOrders();
    const {products, refreshProducts} = useProducts();

    const handleOrder = async (productId: number, productName: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {

            const newOrderItem: CreateOrderItem = {
                itemId: productId,
                itemName: productName,
                quantity: 1,
                price: product.price
            } as const;
            const newOrder: CreateOrderDto = {
                totalPrice: product.price,
                status: 'CONFIRMED',
                items: [
                    newOrderItem
                ]
            };
            console.log(newOrder);
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
        }
    };

    return (
        <div className="relative min-h-screen px-4 py-12">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div
                    className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{animationDelay: '1s'}}></div>
                <div
                    className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/>
                        Back to Home
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-3">
                            <ShoppingBag className="w-8 h-8 text-white"/>
                        </div>
                        <h1 className="text-white">Our Collection</h1>
                    </div>

                    <p className="text-white/80">
                        Browse our carefully curated selection of premium products. Click the order button for instant
                        1-click checkout.
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const isOrdered = orderedItems.has(product.id);
                        const isOutOfStock = product.stock === 0;

                        return (
                            <div
                                key={product.id}
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
                                            Stock: {product.stock}
                                        </span>
                                    </div>

                                    <h3 className="text-white mb-2">{product.name}</h3>

                                    <p className="text-white/70 text-sm mb-4 line-clamp-2">{product.description}</p>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white">{product.price} €</span>
                                    </div>

                                    <button
                                        onClick={() => handleOrder(product.id, product.name)}
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
                    })}
                </div>
            </div>
        </div>
    );
}
