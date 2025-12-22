/**
 * Represents a product item in the catalog.
 * This interface is used for creating new items and displaying product details.
 */
export interface Item {
    /** The display name of the product item. */
    name: string;
    /** The number of units currently available in stock. */
    stock: number;
    /**
     * The price of the product.
     * Can be a number or a string representation of the price.
     */
    price: number | string;
    /** A detailed description of the product item. */
    description: string;
}