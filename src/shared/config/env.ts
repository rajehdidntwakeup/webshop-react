export const ENV = {
    INVENTORY_API_URL: import.meta.env.VITE_API_URL_INVENTORY || 'http://localhost:8080/api/inventory',
    ORDER_API_URL: import.meta.env.VITE_API_URL_ORDER || 'http://localhost:8081/api/order',
} as const;
