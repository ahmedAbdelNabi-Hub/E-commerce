import { IAttribute } from "./IAttribute";

export interface IAttributeValue  {
    value: string;
    attributeId: number;
    attribute?: IAttribute;
  }
  