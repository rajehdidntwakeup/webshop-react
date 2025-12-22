import {HomePage} from '@/pages/home/HomePage';
import {DocsPage} from '@/pages/docs/DocsPage';
import {ProductsPage} from '@/pages/products/ProductsPage';
import {OrdersPage} from '@/pages/orders/OrdersPage';
import {CreateItemPage} from '@/pages/create-item/CreateItemPage';
import {Route, Routes} from 'react-router-dom';
import {Providers} from './providers';
import {BaseLayout} from './layouts/BaseLayout';

export default function App() {
    return (
        <Providers>
            <BaseLayout>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/products" element={<ProductsPage/>}/>
                    <Route path="/docs" element={<DocsPage/>}/>
                    <Route path="/orders" element={<OrdersPage/>}/>
                    <Route path="/create" element={<CreateItemPage/>}/>
                </Routes>
            </BaseLayout>
        </Providers>
    );
}
