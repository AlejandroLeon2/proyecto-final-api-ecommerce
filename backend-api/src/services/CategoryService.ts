import { Firestore, Timestamp } from "firebase-admin/firestore";
import type { ICategory } from "../interface/ICategory.js";
import { STATUS, type IStatus } from "../interface/IStatus.js";
export class CategoryService {
  constructor(public db: Firestore, public collectionName: string) {}

  async createCategory(category: ICategory): Promise<ICategory> {
    const categoryRef = this.db.collection(this.collectionName).doc();
    const categoryData: ICategory = {
      ...category,
      id: categoryRef.id,
      createdAt: Timestamp.now(),
    };
    await categoryRef.set(categoryData);
    return categoryData;
  }

  async getAllCategories(status?: IStatus): Promise<ICategory[]> {
    const query = this.db.collection(this.collectionName);
    if (status) {
      query.where("status", "==", status);
    } else {
      query.where("status", "!=", STATUS.deleted);
    }
    const snapshot = await query.get();
    const categories: ICategory[] = snapshot.docs.map((item) => {
      const data = item.data();
      return {
        id: item.id,
        name: data.name,
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        status: data.status,
      };
    });
    return categories;
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    const categoryRef = await this.db
      .collection(this.collectionName)
      .doc(id)
      .get();
    if (!categoryRef.exists) return null;
    const data = categoryRef.data();
    if (!data) return null;
    return {
      id: categoryRef.id,
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
    const categoryRef = this.db.collection(this.collectionName).doc(id);
    await categoryRef.update({
      ...category,
      updatedAt: Timestamp.now(),
    });
    const categoryUpdated = await this.getCategoryById(id);
    return categoryUpdated!;
  }

  async deleteCategory(id: string) {
    const categoryRef = this.db.collection(this.collectionName).doc(id);
    await categoryRef.update({
      status: STATUS.deleted,
    });
    await categoryRef.delete();
  }
}
