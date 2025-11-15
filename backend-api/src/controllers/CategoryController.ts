import type { Request, Response } from "express";
import admin from "../config/dbFirebase.js";
import { CategoryService } from "../services/CategoryService.js";
import { CustomResponse } from "../utils/CustomResponse.js";

export class CategoryController {
  private service: CategoryService;
  constructor(
    public db: FirebaseFirestore.Firestore = admin.firestore(),
    public collection: string = "categories"
  ) {
    this.service = new CategoryService(db, collection);
  }
  public createCategory = async (req: Request, res: Response) => {
    try {
      const category = req.body;
      if (!category.name) {
        return res
          .status(400)
          .json(CustomResponse.error("P001", "Se requieren mas campos"));
      }
      const categorySave = await this.service.createCategory(category);
      res
        .status(201)
        .json(
          CustomResponse.success(categorySave, "Categoría creada correctamente")
        );
    } catch (error) {
      console.error("Error al crear Categoría:", error);
      return res
        .status(500)
        .json(CustomResponse.error("P002", "Error al crear Categoría"));
    }
  };
  public getAllCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.service.getAllCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.error("Error al obtener Categorías:", error);
      return res
        .status(500)
        .json(CustomResponse.error("P003", "Error al obtener Categorías"));
    }
  };
  public getCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID requerido" });
      }
      const category = await this.service.getCategoryById(id);

      if (!category) {
        return res.status(404).json({ message: "Categoría no encontrada" });
      }
      return res.status(200).json(category);
    } catch (error) {
      console.error("Error al obtener Categoría:", error);
      return res
        .status(500)
        .json(CustomResponse.error("P004", "Error al obtener Categoría"));
    }
  };
  public updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      if (!id) {
        return res.status(400).json({ message: "ID requerido" });
      }
      const categoryUpdated = await this.service.updateCategory(id, updates);

      return res
        .status(200)
        .json(
          CustomResponse.success(
            categoryUpdated,
            "Categoría actualizada correctamente"
          )
        );
    } catch (error) {
      console.error("Error al actualizar Categoría:", error);
      return res.status(500).json({ message: "Error del servidor" });
    }
  };
  public deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "ID requerido" });
      }
      await this.service.deleteCategory(id);
      return res
        .status(200)
        .json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
      console.error("Error al eliminar Categoría:", error);
      return res.status(500).json({ message: "Error del servidor" });
    }
  };
}
