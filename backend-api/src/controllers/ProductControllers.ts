import { ProductService } from "../services/ProductService.js";
import type { Response, Request } from "express";
import admin from "../config/dbFirebase.js";

export class ProductControllers {
  private service: ProductService;
  constructor(
    public db: FirebaseFirestore.Firestore = admin.firestore(),
    public collection: string = "products"
  ) {
    this.service = new ProductService(db, collection);
  }
  public createProductController = async (req: Request, res: Response) => {
    try {
      const product = req.body;
      if (!product.name) {
        return res.status(400).json({ message: "Se requieren mas campos" });
      }
      await this.service.createProduct(product);
      res.status(201).json;
    } catch (error) {
      console.error("Error al crear producto:", error);
      return res.status(500).json({ message: "Error del server" });
    }
  };
  public getAllProductsController = async (req: Request, res: Response) => {
    try {
      const products = await this.service.getAllProducts();
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return res.status(500).json({ message: "Error del servidor" });
    }
  };
  public getProductsController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID requerido" });
      }
      const product = await this.service.getProductById(id);

      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      return res.status(200).json(product);
    } catch (error) {
      console.error("Error al obtener producto:", error);
      return res.status(500).json({ message: "Error del servidor" });
    }
  };
  public updateProductController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (!id) {
        return res.status(400).json({ message: "ID requerido" });
      }
      await this.service.updateProduct(id, updates);
      return res
        .status(200)
        .json({ message: "Producto actualizado correctamente" });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return res.status(500).json({ message: "Error del servidor" });
    }
  };
  public deleteProductController = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID requerido" });
      }
      await this.service.deleteProduct(id);
      return res
        .status(200)
        .json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      return res.status(500).json({ message: "Error del servidor" });
    }
  };
}
