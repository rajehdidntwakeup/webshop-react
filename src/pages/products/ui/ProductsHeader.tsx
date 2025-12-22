import {ArrowLeft, ShoppingBag} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

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

    return (
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
    );
}
