import {useProducts} from '@/entities/product/model/ProductsContext';
import {ProductsHeader} from './ui/ProductsHeader';
import {useProductOrder} from './model/useProductOrder';
import {AnimatedBackground} from '@/pages/orders/ui/AnimatedBackground';
import {ProductsList} from './ui/ProductsList';

export function ProductsPage() {
    const {products} = useProducts();
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
