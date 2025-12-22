/**
 * Represents the data structure for the item creation form.
 * This interface is used to manage the state of the form fields before they are
 * processed and converted to a domain model.
 * 
 * @interface CreateItemFormData
 */
export interface CreateItemFormData {
    /**
     * The name of the product to be created.
     * @type {string}
     */
    name: string;

    /**
     * The quantity of the product available in stock.
     * Represented as a string to handle form input state.
     * @type {string}
     */
    stock: string;

    /**
     * The price of the product.
     * Represented as a string to handle form input state (including decimals).
     * @type {string}
     */
    price: string;

    /**
     * A detailed description of the product.
     * @type {string}
     */
    description: string;
}
