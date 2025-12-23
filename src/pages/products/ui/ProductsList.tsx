import {ProductResponseDto} from '@/entities/product/model/Product';

import {ProductCard} from './ProductCard';

/**
 * Props for the ProductsList component.
 *
 * @interface ProductsListProps
 * @property {ProductResponseDto[]} products - An array of product objects to be displayed.
 * @property {Set<string>} orderedItems - A set containing the IDs of products already ordered in the session.
 * @property {Function} onOrder - Callback function invoked when a product is ordered.
 */
interface ProductsListProps {
    products: ProductResponseDto[];
    orderedItems: Set<string>;
    onOrder: (productId: string, productName: string) => void;
}

/**
 * ProductsList component renders a responsive grid of ProductCard components.
 * It maps through the provided products and determines if each has been ordered.
 *
 * @component
 * @param {ProductsListProps} props - The component props.
 * @returns {JSX.Element} The rendered list of products.
 */
export function ProductsList({products, orderedItems, onOrder}: ProductsListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product.productId}
                    product={product}
                    isOrdered={orderedItems.has(product.productId)}
                    onOrder={onOrder}
                />
            ))}
        </div>
    );
}
