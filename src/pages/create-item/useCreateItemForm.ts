import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Item } from "@/entities/product/model/Item";
import { useProducts } from '@/entities/product/model/ProductsContext';

import { CreateItemFormData } from './CreateItemFormData';

export function useCreateItemForm() {
    const navigate = useNavigate();
    const { addProduct } = useProducts();
    const [formData, setFormData] = useState<CreateItemFormData>({
        name: '',
        stock: '',
        price: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = useCallback((field: keyof CreateItemFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const validate = useCallback((data: CreateItemFormData) => {
        if (!data.name || !data.stock || !data.price || !data.description) {
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

        return true;
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate(formData)) return;

        setIsSubmitting(true);
        try {
            const newItem: Item = {
                name: formData.name,
                stock: parseInt(formData.stock, 10),
                price: parseFloat(formData.price),
                description: formData.description,
            };

            await addProduct(newItem);
            toast.success('Product created successfully!', {
                description: `${formData.name} has been added to the catalog.`,
            });

            // Reset form
            setFormData({ name: '', stock: '', price: '', description: '' });

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
