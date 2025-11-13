import { Firestore } from "firebase-admin/firestore";
import type { ProductInterface } from "../interface/ProductInterface.js";
export class ProductService {
  constructor(public db: Firestore, public collectionName: string) {}

  async createProduct(product: ProductInterface): Promise<ProductInterface> {
    const productSave = this.db.collection(this.collectionName).doc();
    const productId = {
      ...product,
      id: productSave.id,
      createdAt: new Date().toISOString(),
    };
    await productSave.set(productId);
    return productId;
  }

  async getAllProducts(): Promise<ProductInterface[]> {
    const snapshot = await this.db.collection(this.collectionName).get();
    const products: ProductInterface[] = snapshot.docs.map((item) => {
      const data = item.data();
      return {
        id: item.id,
        name: data.name,
        description: data.description,
        price: data.price,
        createdAt: data.createdAt ?? undefined,
        stock: data.stock,
        category: data.category,
        status: data.status,
        image: data.image,
        updatedAt: data.updatedAt ?? undefined,
      };
    });
    return products;
  }
  async getProductById(id: string): Promise<ProductInterface | null> {
    const product = await this.db.collection(this.collectionName).doc(id).get();
    if (!product.exists) return null;
    const data = product.data();
    if (!data) return null;
    return {
      id: product.id,
      name: data.name,
      description: data.description,
      price: data.price,
      createdAt: data.createdAt,
      stock: data.stock,
      category: data.category,
      status: data.status,
      image: data.image,
      updatedAt: data.updatedAt,
    };
  }
  async updateProduct(
    id: string,
    product: Partial<ProductInterface>
  ): Promise<ProductInterface> {
    const productSave = this.db.collection(this.collectionName).doc(id);
    await productSave.update({
      ...product,
      updatedAt: new Date().toISOString(),
    });
    const productUpdated = await this.getProductById(id);
    return productUpdated!;
  }
  async deleteProduct(id: string) {
    const productSave = this.db.collection(this.collectionName).doc(id);
    await productSave.delete();
  }
}
