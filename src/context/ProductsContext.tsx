import { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  stock: number;
  price: string;
  description: string;
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Leather Bag',
    stock: 15,
    price: '$299',
    description: 'Handcrafted leather bag with premium materials and elegant design.',
  },
  {
    id: 2,
    name: 'Designer Sunglasses',
    stock: 24,
    price: '$199',
    description: 'Stylish sunglasses with UV protection and modern frame design.',
  },
  {
    id: 3,
    name: 'Running Shoes Pro',
    stock: 30,
    price: '$159',
    description: 'High-performance running shoes with advanced cushioning technology.',
  },
  {
    id: 4,
    name: 'Wireless Earbuds',
    stock: 50,
    price: '$129',
    description: 'Premium sound quality with active noise cancellation.',
  },
  {
    id: 5,
    name: 'Travel Backpack',
    stock: 20,
    price: '$89',
    description: 'Durable backpack with multiple compartments for all your travel needs.',
  },
  {
    id: 6,
    name: 'Smart Watch Ultra',
    stock: 12,
    price: '$399',
    description: 'Advanced fitness tracking with heart rate monitor and GPS.',
  },
  {
    id: 7,
    name: 'Luxury Watch',
    stock: 8,
    price: '$599',
    description: 'Timeless elegance with Swiss precision and premium materials.',
  },
  {
    id: 8,
    name: 'Designer Jewelry',
    stock: 10,
    price: '$449',
    description: 'Exquisite handcrafted jewelry with attention to every detail.',
  },
  {
    id: 9,
    name: 'Premium Headphones',
    stock: 18,
    price: '$199',
    description: 'Studio-quality sound with comfortable over-ear design.',
  },
];

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children?: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct }}>
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
