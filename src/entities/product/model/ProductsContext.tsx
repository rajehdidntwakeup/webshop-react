import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {ENV} from "@/shared/config/env";
import {Product} from "./Product";

interface ProductsContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);


export async function getProducts(multiCatalog: boolean) {
    console.log(ENV.INVENTORY_API_URL);
    const response = await fetch(`${ENV.INVENTORY_API_URL}?multi-catalog=${multiCatalog}`, {
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

    const refreshProducts = async () => {
        try {
            const data = await getProducts(false);
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    useEffect(() => {
        refreshProducts();
    }, []);

    const addProduct = (product: Omit<Product, 'id'>) => {
        const newProduct: Product = {
            ...product,
            id: Date.now(),
        };
        setProducts(prev => [...prev, newProduct]);
    };

    return (
        <ProductsContext.Provider value={{products, addProduct, refreshProducts}}>
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
