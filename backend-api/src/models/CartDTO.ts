export class CartItemDto {
  productId: string;
  quantity: number;

  constructor(productId: any, quantity: any) {
    this.productId = String(productId);
    this.quantity = Number(quantity);
  }
}

export class CreateCartDto {
  uid: string;
  cart: CartItemDto[];

  constructor(uid: any, items: any[]) {
    this.uid = String(uid);
    this.cart = items.map(
      (item) => new CartItemDto(item.productId, item.quantity)
    );
  }
}
