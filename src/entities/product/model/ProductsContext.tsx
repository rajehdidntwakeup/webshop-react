import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';

import {productApi} from "../api/productApi";

import {ProductRequestDto, ProductResponseDto} from "./Product";

/**
 * Context for managing products within the application.
 */
interface ProductsContextType {
    /** List of all available products. */
    products: ProductResponseDto[];
    /** Indicates if products are currently being loaded. */
    isLoading: boolean;
    /** Error message if product fetching or addition fails, otherwise null. */
    error: string | null;
    /** Multi-catalog toggle state. */
    multiCatalog: boolean;
    /**
     * Sets the multi-catalog toggle state.
     */
    setMultiCatalog: (value: boolean) => void;
    /**
     * Adds a new product to the system.
     * @param product - The product data to add (excluding the ID).
     * @returns A promise that resolves when the product is successfully added and the list is refreshed.
     * @throws Will throw an error if the addition fails.
     */
    addProduct: (product: ProductRequestDto) => Promise<void>;
    /**
     * Refetches the products list from the API.
     * @returns A promise that resolves when the list is updated.
     */
    refreshProducts: () => Promise<void>;
}

/**
 * Context object for products.
 */
export const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

/**
 * Provider component that manages product state and provides product-related actions.
 * It automatically fetches products on mount.
 *
 * @param props.children - React nodes to be wrapped by the provider.
 */
export function ProductsProvider({children}: { children?: ReactNode }) {
    const [products, setProducts] = useState<ProductResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [multiCatalog, setMultiCatalog] = useState(false);

    /**
     * Fetches products from the API and updates state.
     */
    const refreshProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await productApi.getProducts(multiCatalog);
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [multiCatalog]);

    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);

    /**
     * Sends a request to add a new product and refreshes the list upon success.
     */
    const addProduct = useCallback(async (product: ProductRequestDto) => {
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
        <ProductsContext.Provider value={{products, isLoading, error, multiCatalog, setMultiCatalog, addProduct, refreshProducts}}>
            {children}
        </ProductsContext.Provider>
    );
}

/**
 * Custom hook to access the products context.
 * Must be used within a {@link ProductsProvider}.
 *
 * @returns The products context value.
 * @throws Error if used outside of a ProductsProvider.
 */
export function useProducts() {
    const context = useContext(ProductsContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
}
