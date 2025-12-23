import {ArrowLeft, ShoppingBag} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

import {useProducts} from '@/entities/product/model/ProductsContext';

/**
 * ProductsHeader component provides the top section of the products page.
 * It includes a back button to the home page, an icon, a title, and a brief description of the collection.
 *
 * @component
 * @returns {JSX.Element} The rendered products header.
 */
export function ProductsHeader() {
    /**
     * Hook to handle programmatic navigation.
     */
    const navigate = useNavigate();
    const {multiCatalog, setMultiCatalog} = useProducts();

    return (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 mb-8">
            <button
                onClick={() => navigate('/')}
                className="group flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform"/>
                Back to Home
            </button>

            <div className="flex items-center gap-4 mb-4 w-full">
                <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-3">
                    <ShoppingBag className="w-8 h-8 text-white"/>
                </div>
                <h1 className="text-white">Our Collection</h1>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-white/80">
                    Browse our carefully curated selection of premium products. Click the order button for instant
                    1-click checkout.
                </p>

                <div className="flex items-center gap-3 flex-shrink-0 ml-6">
                    <h2 className="text-white text-lg font-semibold">Multi-Catalog</h2>
                    <button
                        onClick={() => setMultiCatalog(!multiCatalog)}
                        className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                            multiCatalog
                                ? 'bg-white text-blue-600 shadow-lg shadow-white/20'
                                : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                        }`}
                    >
                        {multiCatalog ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>
        </div>
    );
}
