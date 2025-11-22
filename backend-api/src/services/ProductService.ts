import type { Firestore } from "firebase-admin/firestore";
import type { ProductInterface } from "../interface/ProductInterface.js";
import { CategoryService } from "./CategoryService.js";

export class ProductService {
  private categoryService: CategoryService;
  constructor(public db: Firestore, public collectionName: string) {
    this.categoryService = new CategoryService(db, "categories");
  }

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
    const snapshot = await this.db
      .collection(this.collectionName)
      .where("status", "==", "active")
      .get();
    const products: ProductInterface[] = await Promise.all(
      snapshot.docs.map(async (item) => {
        const data = item.data();
        const category = await this.categoryService.getCategoryById(
          data.category
        );

        return {
          id: item.id,
          name: data.name,
          description: data.description,
          price: data.price,
          createdAt: data.createdAt ?? undefined,
          stock: data.stock,
          category: category?.name ?? "Sin categoría",
          status: data.status,
          image: data.image,
          updatedAt: data.updatedAt ?? undefined,
        };
      })
    );
    return products;
  }
  async getProductById(id: string): Promise<ProductInterface | null> {
    const product = await this.db.collection(this.collectionName).doc(id).get();
    if (!product.exists) return null;
    const data = product.data();
    if (!data) return null;
        const category = await this.categoryService.getCategoryById(data.category);

    return {
      id: product.id,
      name: data.name,
      description: data.description,
      price: data.price,
      createdAt: data.createdAt,
      stock: data.stock,
      category: category?.name ?? "Sin categoría",
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

  async getPaginatedProducts(
    page: number = 1,
    limit: number = 10
  ): Promise<{ products: ProductInterface[]; totalItems: number }> {
    const offset = (page - 1) * limit;

    const totalSnapshot = await this.db
      .collection(this.collectionName)
      .where("status", "==", "active")
      .get();
    const totalItems = totalSnapshot.size;

    const snapshot = await this.db
      .collection(this.collectionName)
      .where("status", "==", "active")
      .orderBy("createdAt", "desc")
      .offset(offset)
      .limit(limit)
      .get();

    const products: ProductInterface[] = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const category = await this.categoryService.getCategoryById(data.category);

        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: category?.name ?? "Sin categoria",
          status: data.status,
          image: data.image,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      })
    );

    return { products, totalItems };
  }
}
