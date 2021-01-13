export class Product{
    id: number;
  productName: string;
  specialOffer: number;
  normalPrice: number;
  imageName: string;
  description: string;

  constructor(
    id: number,
    productName: string,
    specialOffer: number,
    normalPrice: number,
    imageName: string,
    description: string
  ) {
    this.id = id;
    this.productName = productName;
    this.specialOffer = specialOffer;
    this.normalPrice = normalPrice;
    this.imageName = imageName;
    this.description = description;
  }
}

export class ShoppingCart{
  allProducts: Product[];

  constructor() {
    this.allProducts = new Array<Product>();
  }

  getTotalPrice(): number {
    let price = 0;

    this.allProducts.forEach(product => {
      price += product.specialOffer || product.normalPrice;
    });

    return price;
  }
}