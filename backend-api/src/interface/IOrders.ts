import type { Product } from "../models/Product.js";

export interface OrderItem extends Partial<Product> {
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
