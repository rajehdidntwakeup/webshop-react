import { Welcome } from './components/welcome/Welcome.tsx';
import { Documentation } from './components/learn-more/Documentation.tsx';
import { Products } from './components/product/Products.tsx';
import { Orders } from './components/order/Orders.tsx';
import { CreateItem } from './components/create-item/CreateItem.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { OrderProvider } from './context/OrderContext';
import { ProductsProvider } from './context/ProductsContext';

export default function App() {
  return (
    <BrowserRouter>
      <ProductsProvider>
        <OrderProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <Toaster position="top-center" theme="dark" />
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/products" element={<Products />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/create" element={<CreateItem />} />
            </Routes>
          </div>
        </OrderProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
}
