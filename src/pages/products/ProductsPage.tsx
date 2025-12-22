import {useProducts} from '@/entities/product/model/ProductsContext';
import {AnimatedBackground} from '@/pages/orders/ui/AnimatedBackground';

import {useProductOrder} from './model/useProductOrder';
import {ProductsHeader} from './ui/ProductsHeader';
import {ProductsList} from './ui/ProductsList';

/**
 * ProductsPage component displays a list of available products.
 * It integrates product data from the ProductsContext and order logic from the useProductOrder hook.
 * The page features an animated background and a responsive products grid.
 *
 * @component
 * @returns {JSX.Element} The rendered products page.
 */
export function ProductsPage() {
    /**
     * Data and state from the ProductsContext.
     */
    const {products} = useProducts();

    /**
     * Custom hook to handle ordering logic and track ordered items.
     */
    const {orderedItems, handleOrder} = useProductOrder();

    return (
        <div className="relative min-h-screen px-4 py-12">
            <AnimatedBackground/>

            <div className="relative max-w-7xl mx-auto">
                <ProductsHeader/>

                {/* Products Grid */}
                <ProductsList
                    products={products}
                    orderedItems={orderedItems}
                    onOrder={handleOrder}
                />
            </div>
        </div>
    );
}
