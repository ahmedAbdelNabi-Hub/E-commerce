import { IProduct } from "./IProduct";


export interface GroupedResultDto<Tkey,TData> {
    key: Tkey;  // This represents the category name
    items: TData[];
  }