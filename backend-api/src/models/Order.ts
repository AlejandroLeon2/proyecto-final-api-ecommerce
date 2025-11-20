import type { OrderAddress, OrderItem } from "../interface/IOrders.js";

export class Order {
  constructor(
    public userId: string,
    public items: OrderItem[],
    public address: OrderAddress,
    public total: number,
    public createdAt?: string,
    public id?: string
  ) {}
  toFirestore() {
    return {
      userId: this.userId,
      items: this.items,
      address: this.address,
      total: this.total,
      createdAt: this.createdAt,
    };
  }
}
