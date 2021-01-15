import { Product } from "./product.ts";

export class CartItem {
  count: number = 1;
  product: Product;

  constructor(count: number, product: Product) {
    this.count = count;
    this.product = product;
  }
}
