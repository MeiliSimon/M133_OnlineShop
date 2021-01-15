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