import { IProduct } from "./IProduct";

export interface IProductView {
    IsStoreInRedis : Boolean,
    viewId : string,
    ProductReadDto : IProduct[]
}