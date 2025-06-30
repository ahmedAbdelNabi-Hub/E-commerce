import { SelectedAttribute } from "../../../admin/pages/product-from/components/Attribute/attribute.component";

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
  weight: number;
  dimensions: string
  imageUrl: string;
  linkImage: string;
  isActive: boolean;
  deliveryTimeInDays: number;
  offerPrice: number | null;
  productAttributes: SelectedAttribute[]
  offerStartDate: string | null;
  offerEndDate: string | null;
  createdAt: string;
  updatedAt: string;
}
