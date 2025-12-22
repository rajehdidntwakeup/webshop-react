import {ArrowLeft, Package, Search, ShoppingCart} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

export function DocsPage() {
    const navigate = useNavigate();

    const sections = [
        {
            title: 'Browse Products',
            icon: Search,
            steps: [
                'Use the category cards on the homepage to filter products by type',
                'Scroll through the featured products section to discover trending items',
                'Click on any product card to view detailed information and specifications',
            ],
        },
        {
            title: 'Shopping Cart',
            icon: ShoppingCart,
            steps: [
                'Click the cart icon on any product to add it to your shopping cart',
                'Access your cart from the top navigation bar at any time',
                'Review items, adjust quantities, or remove products before checkout',
            ],
        },
    ];

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

            <div className="relative max-w-5xl mx-auto">
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
                            <Package className="w-8 h-8 text-white"/>
                        </div>
                        <h1 className="text-white">How to Use Our Webshop</h1>
                    </div>

                    <p className="text-white/80">
                        Welcome to our comprehensive guide on navigating and using the LiquidShop web catalog.
                        Follow these simple steps to make the most of your shopping experience.
                    </p>
                </div>

                {/* Documentation Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-xl p-2">
                                    <section.icon className="w-6 h-6 text-white"/>
                                </div>
                                <h2 className="text-white">{section.title}</h2>
                            </div>

                            <ol className="space-y-3">
                                {section.steps.map((step, stepIndex) => (
                                    <li key={stepIndex} className="flex gap-3 text-white/80">
                    <span
                        className="backdrop-blur-md bg-white/20 border border-white/30 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {stepIndex + 1}
                    </span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>

                {/* Additional Tips */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
                    <h2 className="text-white mb-4">Additional Tips</h2>

                    <div className="space-y-4 text-white/80">
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
                            <h3 className="text-white mb-2">💡 Quick Tip</h3>
                            <p>Use the search bar to quickly find specific products by name, category, or brand.</p>
                        </div>

                        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4">
                            <h3 className="text-white mb-2">📱 Mobile Friendly</h3>
                            <p>Our catalog is fully responsive and optimized for mobile devices. Shop anywhere,
                                anytime!</p>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="group backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white px-8 py-4 rounded-full transition-all duration-300 inline-flex items-center gap-2"
                        >
                            Start Shopping
                            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
