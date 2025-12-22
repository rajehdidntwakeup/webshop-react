import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {ENV} from "@/shared/config/env";
import {Product} from "./Product";

const INVENTORY_URL = ENV.INVENTORY_API_URL;

interface ProductsContextType {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);


export async function getProducts(multiCatalog: boolean) {
    console.log(ENV.INVENTORY_API_URL);
    const response = await fetch(`${INVENTORY_URL}?multi-catalog=${multiCatalog}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Failed to load products');
    const data: Product[] = await response.json();
    return data;
}

export function ProductsProvider({children}: { children?: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getProducts(false);
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
            const response = await fetch(`${INVENTORY_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
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
