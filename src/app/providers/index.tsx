import {ReactNode} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {ProductsProvider} from '@/entities/product/model/ProductsContext';
import {OrderProvider} from '@/entities/order/model/OrderContext';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({children}: ProvidersProps) {
    return (
        <BrowserRouter>
            <ProductsProvider>
                <OrderProvider>
                    {children}
                </OrderProvider>
            </ProductsProvider>
        </BrowserRouter>
    );
}
