import { IBasket } from "../interfaces/Basket/IBasket";
import { IBasketItem } from "../interfaces/Basket/IBasketItem";
import { v4 as uuidv4 } from 'uuid';

export class Basket implements IBasket {
    id = uuidv4();
    basketItems: IBasketItem[] = [];
}