import {ArrowRight, Package, Plus, ShoppingBag} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

/**
 * HomePage component serves as the landing page of the Webshop application.
 * It features a modern, visually appealing design with animated background elements,
 * a glassmorphism-styled card, and quick access navigation buttons.
 *
 * @component
 * @returns {JSX.Element} The rendered home page.
 */
export function HomePage() {
    /**
     * Hook to handle programmatic navigation within the application.
     */
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
            {/* 
                Animated background elements:
                Three floating, blurred circles that pulse to create a dynamic atmosphere.
            */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div
                    className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{animationDelay: '1s'}}></div>
                <div
                    className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{animationDelay: '2s'}}></div>
            </div>

            {/* 
                Glass card:
                The main content container utilizing backdrop-blur for a semi-transparent glass effect.
            */}
            <div className="relative max-w-4xl w-full">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
                    {/* Header Icon */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-4">
                            <ShoppingBag className="w-12 h-12 text-white"/>
                        </div>
                    </div>

                    <h1 className="text-center text-white mb-4">
                        Welcome to our Webshop
                    </h1>

                    <p className="text-center text-white/80 mb-8 max-w-2xl mx-auto">
                        Discover our curated collection of premium products. Experience shopping reimagined with elegant
                        design and seamless functionality.
                    </p>

                    {/* 
                        Navigation Actions:
                        Buttons for primary user flows: Browse Products, Create Item, View Orders, and Documentation.
                    */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate('/products')}
                            className="group backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2"
                        >
                            Explore Collection
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
                        </button>

                        <button
                            onClick={() => navigate('/create')}
                            className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5"/>
                            Create Item
                        </button>

                        <button
                            onClick={() => navigate('/orders')}
                            className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2"
                        >
                            <Package className="w-5 h-5"/>
                            Orders
                        </button>

                        <button
                            onClick={() => navigate('/docs')}
                            className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-full transition-all duration-300"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
