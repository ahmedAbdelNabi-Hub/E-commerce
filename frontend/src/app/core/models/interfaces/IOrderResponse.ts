export interface IOrderResponse {
    orderId: number;
    checkoutUrl?: string; // Optional (only if payment is online)
    message: string;
}