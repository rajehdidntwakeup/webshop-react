/** Data Transfer Object for product response from API */
export interface ProductResponseDto {
    /** Unique identifier for the product */
    productId: string;
    /** European Article Number (barcode) */
    ean: string;
    /** Name of the product */
    name: string;
    /** Detailed description of the product */
    description: string;
    /** Price of the product */
    price: number;
    /** Available quantity in stock */
    quantity: number;
    /** Brand name of the product */
    brand: string;
    /** Date and time when the product was created */
    createdAt: string;
    /** Date and time when the product was last updated */
    updatedAt: string;
    /** ID of the external shop if applicable */
    externalShopId: string | null;
}

/** Data Transfer Object for creating or updating a product */
export interface ProductRequestDto {
    /** European Article Number (barcode) */
    ean: string;
    /** Name of the product */
    name: string;
    /** Detailed description of the product */
    description: string;
    /** Price of the product */
    price: number;
    /** Available quantity in stock */
    quantity: number;
    /** Brand name of the product */
    brand: string;
}

