import type { ICategory } from "./ICategory.js";
import type { IStatus } from "./IStatus.js";

export interface ProductInterface {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  stock: number;
  category: string | Partial<ICategory>;
  status: IStatus;
  image: string;
  updatedAt?: string;
}
