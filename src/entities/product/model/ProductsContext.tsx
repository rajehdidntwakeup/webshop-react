import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {Product} from "./Product";
import * as productApi from "../api/productApi";

interface ProductsContextType {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({children}: { children?: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await productApi.getProducts(false);
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);

    const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
        setError(null);
        try {
            await productApi.addProduct(product);
            await refreshProducts();
        } catch (err) {
            console.error('Error adding product:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        }
    }, [refreshProducts]);

    return (
        <ProductsContext.Provider value={{products, isLoading, error, addProduct, refreshProducts}}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
}
