import { IProductAttribute } from "./IProductAttribute";

export interface IProduct {
  id: number;
  name: string;
  description: string;
  brand: string;
  sku: string;
  categoryId: number;
  categoryName: string,
  price: number;
  discount: number;
  stockQuantity: number;
  Weight :number;
  Dimensions :string
  imageUrl: string;
  linkImage: string;
  offerPrice: number | null;
  productAttributes: IProductAttribute[]
  offerStartDate: string | null;
  offerEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}
