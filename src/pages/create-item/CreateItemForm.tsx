import { Package } from 'lucide-react';
import React from 'react';

import {ProductRequestDto} from "@/entities/product/model/Product.ts";

/**
 * Interface for the CreateItemForm component props.
 */
interface CreateItemFormProps {
    /** The current state of the form data. */
    formData: ProductRequestDto;
    /** Function to update a specific field in the form data. */
    updateField: (field: keyof ProductRequestDto, value: string) => void;
    /** Form submission handler. */
    handleSubmit: (e: React.FormEvent) => void;
    /** Indicates if the form is currently being submitted. */
    isSubmitting: boolean;
}

/**
 * A form component for creating a new product item.
 * 
 * This component renders a styled form with fields for product name, stock quantity,
 * price, and description. It uses glassmorphism design elements.
 *
 * @param props - The component props.
 * @returns A JSX element representing the creation form.
 */
export function CreateItemForm({ formData, updateField, handleSubmit, isSubmitting }: CreateItemFormProps) {
    return (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product EAN */}
                <div>
                    <label htmlFor="ean" className="block text-white mb-2">
                        Product EAN
                    </label>
                    <input
                        type="text"
                        id="ean"
                        value={formData.ean}
                        onChange={(e) => updateField('ean', e.target.value)}
                        placeholder="e.g., 0123456789123"
                        className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        disabled={isSubmitting}
                    />
                </div>
                {/* Product Name */}
                <div>
                    <label htmlFor="name" className="block text-white mb-2">
                        Product Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="e.g., Premium Leather Bag"
                        className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Brand Name */}
                <div>
                    <label htmlFor="brand" className="block text-white mb-2">
                        Brand Name
                    </label>
                    <input
                        type="text"
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => updateField('brand', e.target.value)}
                        placeholder="e.g., Prada"
                        className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Stock Quantity */}
                <div>
                    <label htmlFor="quantity" className="block text-white mb-2">
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        value={formData.quantity}
                        onChange={(e) => updateField('quantity', e.target.value)}
                        placeholder="e.g., 50"
                        min="0"
                        className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        disabled={isSubmitting}
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
                            // Regex validation for decimal price (e.g., 10.99)
                            // Allows empty string or digits with up to 2 decimal places
                            if (val === '' || /^\d+\.?\d{0,2}$/.test(val)) {
                                updateField('price', val);
                            }
                        }}
                        placeholder="e.g., 299.99"
                        className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                        disabled={isSubmitting}
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
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="e.g., Handcrafted leather bag with premium materials..."
                        rows={4}
                        className="w-full backdrop-blur-md bg-white/20 border border-white/30 text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                >
                    <Package className="w-5 h-5"/>
                    {isSubmitting ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
}
