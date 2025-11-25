import type { Firestore, Query } from "firebase-admin/firestore"; // Importamos Query para tipado
import type { ICategory } from "../interface/ICategory.js";
import { STATUS, type IStatus } from "../interface/IStatus.js";
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

  async getAllProducts(status?: IStatus[]): Promise<ProductInterface[]> {
    const query = this.db
      .collection(this.collectionName)
      .where(
        "status",
        status?.length ? "in" : "==",
        status?.length ? status : STATUS.active
      );

    const snapshot = await query.get();

    const categories = (
      await this.categoryService.getAllCategories(STATUS.active)
    ).reduce<Record<string, ICategory>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});

    const products = snapshot.docs.map((item) => {
      const data = item.data();
      const category = categories[data.category];

      return {
        id: item.id,
        name: data.name,
        description: data.description,
        price: data.price,
        createdAt: data.createdAt ?? undefined,
        stock: data.stock,
        category,
        status: data.status,
        image: data.image,
        updatedAt: data.updatedAt ?? undefined,
      };
    });

    return products.filter((product) => product.category) as ProductInterface[];
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
      category: category || { id: "default" },
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
    const productRef = this.db.collection(this.collectionName).doc(id);
    await productRef.update({
      status: STATUS.deleted,
    });
  }
  // --- MÉTODO CON LOGS DE DEPURACIÓN ---
  async getPaginatedProducts(
    page: number = 1,
    limit: number = 10,
    categories: string[] = [] // Nuevo parámetro de categorías
  ): Promise<{ products: ProductInterface[]; totalItems: number }> {
    const offset = (page - 1) * limit;

    //filtrar categorias activas
    const activeCategoryDocs = await this.categoryService.getCategoriesMap(
      categories,
      [STATUS.active]
    );

    let baseQuery: Query = this.db
      .collection(this.collectionName)
      .where("status", "==", "active");

    const categoriesIds = Object.keys(activeCategoryDocs);
    if (categoriesIds.length) {
      baseQuery = baseQuery.where("category", "in", categoriesIds);
    } else {
      return { products: [], totalItems: 0 };
    }

    // Filtrar documentos activos
    const snapshot = await baseQuery
      .orderBy("createdAt", "desc")
      .offset(offset)
      .limit(limit)
      .get();

    const totalItems = snapshot.size;

    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      const category = activeCategoryDocs[data.category];

      if (!category || category.status !== STATUS.active) return null;

      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category,
        status: data.status,
        image: data.image,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });

    const filteredProducts = products.filter(
      (p) => p !== null
    ) as ProductInterface[];

    return { products: filteredProducts, totalItems };
  }
}
