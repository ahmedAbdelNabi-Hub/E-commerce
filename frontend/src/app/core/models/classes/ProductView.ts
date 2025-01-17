import { IProduct } from "../interfaces/IProduct";
import { IProductView } from "../interfaces/IProductView";

export class ProductView implements IProductView {
    IsStoreInRedis: Boolean = false;
    viewId: string = crypto.randomUUID();
    ProductReadDto: IProduct[] = [];
}