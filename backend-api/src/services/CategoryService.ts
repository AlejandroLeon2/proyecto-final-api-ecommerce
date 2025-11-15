import { Firestore } from "firebase-admin/firestore";
import type { ICategory } from "../interface/ICategory.js";
export class CategoryService {
  constructor(public db: Firestore, public collectionName: string) {}

  async createCategory(category: ICategory): Promise<ICategory> {
    const categorySave = this.db.collection(this.collectionName).doc();
    const categoryId = {
      ...category,
      id: categorySave.id,
      createdAt: new Date().toISOString(),
    };
    await categorySave.set(categoryId);
    return categoryId;
  }

  async getAllCategories(): Promise<ICategory[]> {
    const snapshot = await this.db.collection(this.collectionName).get();
    const categories: ICategory[] = snapshot.docs.map((item) => {
      const data = item.data();
      return {
        id: item.id,
        name: data.name,
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        status: data.status ?? "active",
      };
    });
    return categories;
  }
  async getCategoryById(id: string): Promise<ICategory | null> {
    const category = await this.db
      .collection(this.collectionName)
      .doc(id)
      .get();
    if (!category.exists) return null;
    const data = category.data();
    if (!data) return null;
    return {
      id: category.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.status,
    };
  }
  async updateCategory(
    id: string,
    category: Partial<ICategory>
  ): Promise<ICategory> {
    const categorySave = this.db.collection(this.collectionName).doc(id);
    await categorySave.update({
      ...category,
      updatedAt: new Date().toISOString(),
    });
    const categoryUpdated = await this.getCategoryById(id);
    return categoryUpdated!;
  }
  async deleteCategory(id: string) {
    const categorySave = this.db.collection(this.collectionName).doc(id);
    await categorySave.delete();
  }
}
