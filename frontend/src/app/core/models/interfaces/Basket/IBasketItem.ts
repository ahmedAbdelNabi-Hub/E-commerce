export interface IBasketItem {
    productId: number;       
    productName: string;     
    description: string;   
    brand: string;           
    quantity: number;  
    price: number;           
    offerPrice: number | null; 
    imageUrl: string;  
    unitOfStock:number,
    subTotal: number;   
}