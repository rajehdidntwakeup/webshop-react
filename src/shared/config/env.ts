/**
 * Environment configuration object.
 * Contains API URLs and other environment-specific settings.
 */
export const ENV = {
    /**
     * Base URL for the Inventory API.
     * Falls back to localhost:8080 if VITE_API_URL_INVENTORY is not defined.
     */
    INVENTORY_API_URL: import.meta.env.VITE_API_URL_INVENTORY,
    
    /**
     * Base URL for the Order API.
     * Falls back to localhost:8081 if VITE_API_URL_ORDER is not defined.
     */
    ORDER_API_URL: import.meta.env.VITE_API_URL_ORDER,
} as const;
