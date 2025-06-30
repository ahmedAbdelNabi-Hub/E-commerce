import { IAddress } from "./IAddress"
import { IDeliveryMethod } from "./IDeliveryMethod"
import { IOrderItems } from "./IOrderItems"

export interface IOrder{
    id : number,
    buyerEmail : string,
    orderDate : Date,
    shippingAddress : IAddress
    deliveryMethod :IDeliveryMethod
    items : IOrderItems[],
    status : string,
    subTotal : number,
    paymentMethod : string,
    paymentIntentId : string
}