import {ENV} from "@/shared/config/env";
import {Product} from "../model/Product";

const INVENTORY_URL = ENV.INVENTORY_API_URL;

export async function getProducts(multiCatalog: boolean = false): Promise<Product[]> {
    const response = await fetch(`${INVENTORY_URL}?multi-catalog=${multiCatalog}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Failed to load products');
    return response.json();
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await fetch(`${INVENTORY_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    if (!response.ok) {
        throw new Error('Failed to add product');
    }
    return response.json();
}
