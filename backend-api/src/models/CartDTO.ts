export class CartItemDto {
  productId: string;
  amount: number;

  constructor(productId: any, amount: any) {
    this.productId = String(productId);
    this.amount = Number(amount);
  }
}

export class CreateCartDto {
  uid: string;
  items: CartItemDto[];

  constructor(uid: any, items: any[]) {
    this.uid = String(uid);
    this.items = items.map(
      (item) => new CartItemDto(item.productId, item.amount)
    );
  }
}
