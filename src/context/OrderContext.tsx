import { createContext, useContext, useState, ReactNode } from 'react';

interface Order {
  id: number;
  productId: number;
  productName: string;
  price: string;
  orderedAt: Date;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderedAt'>) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children?: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (order: Omit<Order, 'id' | 'orderedAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      orderedAt: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
