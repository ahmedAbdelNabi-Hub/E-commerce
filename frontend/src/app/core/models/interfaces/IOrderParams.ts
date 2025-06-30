import { IAddress } from "./IAddress";

export interface IOrderParams {
    basketId: string,
    deliveryMethodId: number,
    shippingAddress: IAddress,
    paymentMethod: string,
}