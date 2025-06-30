import { IAttribute } from "./IAttribute";
import { IAttributeValue } from "./IAttributeValue";

export interface IProductAttributeValue {
    productId: number;
    attributeId: number;
    attributeValueId: number;
    product?: any;
    attribute?: IAttribute;
    attributeValue?: IAttributeValue;
}