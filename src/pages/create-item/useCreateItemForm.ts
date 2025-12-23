import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ProductRequestDto } from '@/entities/product/model/Product';
import { useProducts } from '@/entities/product/model/ProductsContext';

/**
 * State structure for the create item form.
 * Note: price and quantity are stored as strings during input and parsed on submission.
 */
interface CreateItemFormState {
    /** European Article Number (barcode) */
    ean: string;
    /** Product name */
    name: string;
    /** Product description */
    description: string;
    /** Product price (as string for input handling) */
    price: string;
    /** Available quantity (as string for input handling) */
    quantity: string;
    /** Brand name */
    brand: string;
}

/**
 * Custom hook to manage the state and logic for the create product form.
 * Handles form validation, submission, and state updates.
 *
 * @returns {Object} Form state and handlers.
 * @returns {CreateItemFormState} .formData - Current form data.
 * @returns {Function} .updateField - Function to update a form field.
 * @returns {Function} .handleSubmit - Function to handle form submission.
 * @returns {boolean} .isSubmitting - Loading state during submission.
 */
export function useCreateItemForm() {
    const navigate = useNavigate();
    const { addProduct } = useProducts();
    const [formData, setFormData] = useState<CreateItemFormState>({
        ean: '',
        name: '',
        description: '',
        price: '',
        quantity: '',
        brand: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = useCallback((field: keyof CreateItemFormState, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const validate = useCallback((data: CreateItemFormState) => {
        if (!data.ean || !data.name || !data.quantity || !data.price || !data.description || !data.brand) {
            toast.error('Please fill in all fields');
            return false;
        }

        const priceRegex = /^\d+(\.\d{1,2})?$/;
        if (!priceRegex.test(data.price)) {
            toast.error('Invalid price format', {
                description: 'Please enter a number (e.g., 299 or 299.99)',
            });
            return false;
        }

        const quantityRegex = /^\d+$/;
        if (!quantityRegex.test(data.quantity)) {
            toast.error('Invalid quantity format', {
                description: 'Please enter a whole number',
            });
            return false;
        }

        return true;
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate(formData)) return;

        setIsSubmitting(true);
        try {
            const newItem: ProductRequestDto = {
                ean: formData.ean,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity, 10),
                brand: formData.brand,
            };

            await addProduct(newItem);
            toast.success('Product created successfully!', {
                description: `${formData.name} has been added to the catalog.`,
            });

            // Reset form
            setFormData({ ean: '', name: '', description: '', price: '' , quantity: '', brand: '' });

            // Navigate after success
            setTimeout(() => {
                navigate('/products');
            }, 1500);
        } catch (err) {
            console.error('Error creating product:', err);
            toast.error('Error creating product');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, addProduct, navigate, validate]);

    return {
        formData,
        updateField,
        handleSubmit,
        isSubmitting
    };
}
