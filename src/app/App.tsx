import {Route, Routes} from 'react-router-dom';

import {CreateItemPage} from '@/pages/create-item/CreateItemPage';
import {DocsPage} from '@/pages/docs/DocsPage';
import {HomePage} from '@/pages/home/HomePage';
import {OrdersPage} from '@/pages/orders/OrdersPage';
import {ProductsPage} from '@/pages/products/ProductsPage';


import {BaseLayout} from './layouts/BaseLayout';
import {Providers} from './providers';

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
