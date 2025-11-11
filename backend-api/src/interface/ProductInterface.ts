export interface ProductInterface {
  id: string;
  name: string;
  description: string;
  price: number;
  createdAt: string;
  stock: number;
  category: string;
  status: "active" | "inactive";
  image: string;
  updatedAt?: string;
}
