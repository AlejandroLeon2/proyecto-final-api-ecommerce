import type { Request, Response } from "express";
import { CartService } from "../services/CartService.js";
import { CartItemDto } from "../models/CartDTO.js";
import { CustomResponse } from "../utils/CustomResponse.js";
import admin from "../config/dbFirebase.js";
import type { ICartItem } from "../interface/ICartItem.js";
export class CartControllers {
  private cartService: CartService;
  constructor(
    public db: FirebaseFirestore.Firestore = admin.firestore(),
    public collectionName: string = "usuario"
  ) {
    this.cartService = new CartService(db, collectionName);
  }
  public createCart = async (req: Request, res: Response) => {
    try {
      const { uid, cart } = req.body;
      if (!Array.isArray(cart)) {
        return res
          .status(400)
          .json(CustomResponse.error("P001", "El carrito debe ser un array"));
      }
      const dtoCart = cart.map(
        (item: ICartItem) => new CartItemDto(item.productId, item.quantity)
      );
      const plainCart = dtoCart.map((item: ICartItem) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      const cartSave = await this.cartService.createCart(uid, plainCart);
      return res
        .status(201)
        .json(CustomResponse.success(cartSave, "Carrito Creado"));
    } catch (error) {
      console.error("Error en createCart:", error);
      return res
        .status(500)
        .json(CustomResponse.error("P002", "Error al crear Carrito"));
    }
  };
  public getCartEnriched = async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      if (!uid) {
        return res
          .status(400)
          .json(
            CustomResponse.error("P001", "Se requieren el uid del usuario")
          );
      }
      const cartSave = await this.cartService.getCartEnriched(uid);
      if (!cartSave || cartSave.length == 0) {
        return res
          .status(404)
          .json(CustomResponse.error("P001", "Usuario sin carrito guardado"));
      }

      return res
        .status(200)
        .json(CustomResponse.success(cartSave, `Carrito del usaurio ${uid}`));
    } catch (error) {
      return res
        .status(500)
        .json(CustomResponse.error("P002", "Error al consular el Carrito"));
    }
  };
  public updateCart = async (req: Request, res: Response) => {
    try {
      const { uid, cart } = req.body;
      const dtoCart = cart.map(
        (item: ICartItem) => new CartItemDto(item.productId, item.quantity)
      );
      const plainCart = dtoCart.map((item: ICartItem) => ({
        productId: item.productId,
        amount: item.quantity,
      }));
      const cartUpdate = await this.cartService.updateCart(uid, plainCart);
      return res
        .status(202)
        .json(
          CustomResponse.success(
            cartUpdate,
            `Carrito del usuario ${uid} actualizado exitosamanete`
          )
        );
    } catch (error) {
      return res
        .status(500)
        .json(CustomResponse.error("P002", "Error al actualizar el Carrito"));
    }
  };
  public deleteCart = async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      if (!uid) {
        return res
          .status(400)
          .json(CustomResponse.error("P001", "Se requiere el uid "));
      }
      await this.cartService.deleteCart(uid);
      return res
        .status(202)
        .json(CustomResponse.success(uid, "Carrito eliminado correctamente"));
    } catch (error) {
      return res
        .status(500)
        .json(CustomResponse.error("P002", "Error al eliminar carrito "));
    }
  };
}
