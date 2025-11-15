export interface ICartItem{
    productId:string;
    amount:number;
}
export interface ICartItemResponse extends ICartItem{
    image:string;
    name:string;
    price:number;
    stock:number;
}
