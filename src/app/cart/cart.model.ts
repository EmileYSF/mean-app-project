import { Product } from '../products/product.model';

export interface Cart {
    product: Product;
    count: number;
}
