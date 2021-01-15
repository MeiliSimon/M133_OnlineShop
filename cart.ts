import { CartItem } from "./cartItem.ts";

export class Cart {
  cartItems: CartItem[];

  constructor() {
    this.cartItems = new Array<CartItem>();
  }

  Count(): number {
    let count: number = 0;
    this.cartItems.forEach((item: CartItem) => (count += item.count));
    return count;
  }

  Total(): number {
    let total: number = 0;
    this.cartItems.forEach(
      (item: CartItem) =>
        (total +=
          (item.product.specialOffer == null
            ? item.product.normalPrice
            : item.product.specialOffer) * item.count)
    );
    return total;
  }
}
