export interface ICartItem{
    productId:string;
    quantity:number;
}
export interface ICartItemResponse extends ICartItem{
    image:string;
    name:string;
    price:number;
    stock:number;
}
