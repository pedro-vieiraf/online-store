export type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    description: string;
}

export interface CartProduct extends Product {
    quantity: number
}