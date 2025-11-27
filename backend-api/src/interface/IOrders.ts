import type { ProductInterface } from "./ProductInterface.js";

export interface OrderItem extends Partial<ProductInterface> {
  quantity: number;
}

export interface OrderAddress {
  street: string;
  number: string;
  city: string;
}

export interface Order {
  id?: string;
  userId: string;
  user?: { name: string; email: string };
  items: OrderItem[];
  address: OrderAddress;
  total: number;
  createdAt: number;
}
