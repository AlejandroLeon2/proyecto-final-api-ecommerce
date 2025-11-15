import type { Request, Response } from "express";
import admin from "../config/dbFirebase.js";
import { ProductService } from "../services/ProductService.js";
import { CustomResponse } from "../utils/CustomResponse.js";
import cloudinary from "../config/cloudinary.js";

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
        return res
          .status(400)
          .json(CustomResponse.error("P001", "Se requieren mas campos"));
      }
      product.price = Number(product.price);
      product.stock = Number(product.stock);
      const productSave = await this.service.createProduct(product);
      const productUpdated = await this.updateImage(productSave.id, req.file!);
      res
        .status(201)
        .json(
          CustomResponse.success(
            productUpdated || productSave,
            "Producto creado correctamente"
          )
        );
    } catch (error) {
      console.error("Error al crear producto:", error);
      return res
        .status(500)
        .json(CustomResponse.error("P002", "Error al crear producto"));
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
      delete updates.image;
      updates.price = Number(updates.price);
      updates.stock = Number(updates.stock);
      const productUpdated = await this.service.updateProduct(id, updates);
      const productUpdatedImage = await this.updateImage(id, req.file!);

      return res
        .status(200)
        .json(
          CustomResponse.success(
            productUpdatedImage || productUpdated,
            "Producto actualizado correctamente"
          )
        );
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

  public uploadImage = async (
    id: string,
    file: Express.Multer.File
  ): Promise<string | null> => {
    try {
      if (!file) {
        return null;
      }

      const b64 = Buffer.from(file.buffer).toString("base64");
      let dataURI = "data:" + file.mimetype + ";base64," + b64;

      const cloudinaryResult = await cloudinary.v2.uploader.upload(dataURI, {
        public_id: `product_${id}`, // Usar el ID del producto para el nombre de la imagen
        asset_folder: "ecommerce/products",
      });

      // Obtener la URL de la imagen subida
      const imageUrl = cloudinaryResult.secure_url;
      return imageUrl;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      return null;
    }
  };
  public updateImage = async (id: string, file: Express.Multer.File) => {
    if (file) {
      try {
        const imageUrl = await this.uploadImage(id, file);

        if (imageUrl) {
          return await this.service.updateProduct(id, { image: imageUrl });
        }
      } catch (error) {
        console.error("Error al actualizar imagen:", error);
      }
    }
  };
}
