import {ArrowLeft, Package, Plus} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import React, {useState} from 'react';
import {useProducts} from '@/entities/product/model/ProductsContext';
import {toast} from 'sonner';
import {Item} from "@/entities/product/model/Item";


export function CreateItemPage() {
    const navigate = useNavigate();
    const {addProduct} = useProducts();
    const [formData, setFormData] = useState({
        name: '',
        stock: '',
        price: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.stock || !formData.price || !formData.description) {
            toast.error('Please fill in all fields');
            return;
        }

        // Validate price: numbers or decimal with up to 2 places
        const priceRegex = /^\d+(\.\d{1,2})?$/;
        if (!priceRegex.test(formData.price)) {
            toast.error('Invalid price format', {
                description: 'Please enter a number (e.g., 299 or 299.99)',
            });
            return;
        }

        const newItem: Item = {
            name: formData.name,
            stock: parseInt(formData.stock),
            price: parseFloat(formData.price),
            description: formData.description,
        } as const;

        try {
            await addProduct(newItem);
            console.log('Product created successfully!');
            toast.success('Product created successfully!', {
                description: `${formData.name} has been added to the catalog.`,
            });
        } catch (err) {
            console.error('Error creating product:', err);
            toast.error('Error creating product');
        }

        // Reset form
        setFormData({name: '', stock: '', price: '', description: ''});

        // Navigate to the products page after a short delay
        setTimeout(() => {
            navigate('/products');
        }, 1500);
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

            <div className="relative max-w-2xl mx-auto">
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
                            <Plus className="w-8 h-8 text-white"/>
                        </div>
                        <h1 className="text-white">Create New Item</h1>
                    </div>

                    <p className="text-white/80">
                        Add a new product to your catalog. Fill in the details below.
                    </p>
                </div>

                {/* Form */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label htmlFor="name" className="block text-white mb-2">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g., Premium Leather Bag"
                                className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label htmlFor="stock" className="block text-white mb-2">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                id="stock"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                placeholder="e.g., 50"
                                min="0"
                                className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-white mb-2">
                                Price
                            </label>
                            <input
                                type="text"
                                id="price"
                                value={formData.price}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '' || /^\d+\.?\d{0,2}$/.test(val)) {
                                        setFormData({...formData, price: val});
                                    }
                                }}
                                placeholder="e.g., 299.99"
                                className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-white mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="e.g., Handcrafted leather bag with premium materials..."
                                rows={4}
                                className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Package className="w-5 h-5"/>
                            Create Product
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
