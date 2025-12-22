import {ReactNode} from 'react';
import {Toaster} from 'sonner';

interface LayoutProps {
    children: ReactNode;
}

export function BaseLayout({children}: LayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <Toaster position="top-center" theme="dark"/>
            {children}
        </div>
    );
}
