import {Product} from '@/entities/product/model/Product';
import {ProductCard} from './ProductCard';

interface ProductsListProps {
    products: Product[];
    orderedItems: Set<number>;
    onOrder: (productId: number, productName: string) => void;
}

export function ProductsList({products, orderedItems, onOrder}: ProductsListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isOrdered={orderedItems.has(product.id)}
                    onOrder={onOrder}
                />
            ))}
        </div>
    );
}
