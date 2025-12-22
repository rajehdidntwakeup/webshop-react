/**
 * Represents a product in the system.
 */
export interface Product {
    /** The unique identifier of the product. */
    id: number;
    /** The name of the product. */
    name: string;
    /** The number of units available in stock. */
    stock: number;
    /** The price of the product. */
    price: string;
    /** A detailed description of the product. */
    description: string;
}