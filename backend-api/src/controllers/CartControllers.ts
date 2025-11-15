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
    public collectionName: string = "user"
  ) {
    this.cartService = new CartService(db, collectionName);
  }
  public createCart = async (req: Request, res: Response) => {
    try {
      const { uid, cart } = req.body;
      const dtoCart = cart.map((item: ICartItem) => {
        new CartItemDto(item.productId, item.amount);
      });
      const cartSave = await this.cartService.createCart(uid, dtoCart);
      return res
        .status(201)
        .json(CustomResponse.success(cartSave, "Carrito Creado"));
    } catch (error) {
      return res
        .status(500)
        .json(CustomResponse.error("P001", "Error al crear Carrito"));
    }
  };
  public getCartEnriched = async ()=>{
    
  }
}
