import type { ICartItem, ICartItemResponse } from "../interface/ICartItem.js";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import { ProductService } from "./ProductService.js";

export class CartService {
  private productService: ProductService;

  constructor(public db: Firestore, public collectionName: string) {
    this.productService = new ProductService(db, collectionName);
  }

  async createCart(uid: string, cartUser: ICartItem[]): Promise<ICartItem[]> {
    const userSave = this.db.collection(this.collectionName).doc(uid);
    await userSave.set({ cart: cartUser }, { merge: true });
    return cartUser;
  }

  async getCartEnriched(uid: string): Promise<ICartItemResponse[]> {
    const cartUser = await this.db
      .collection(this.collectionName)
      .doc(uid)
      .get();
    const cart = cartUser.data()?.cart || [];
    const cartEnriched = await Promise.all(
      cart.map(async (item:ICartItem) => {
        const product = await this.productService.getProductById(item.productId);
        return { ...item, ...product };
      })
    );
    return cartEnriched;
  }
  async updateCart(uid: string, cart: ICartItem[]): Promise<ICartItem[]> {
    await this.db.collection(this.collectionName).doc(uid).update({ cart });
    return cart;
  }
  async deleteCart(uid: string): Promise<void> {
    await this.db
      .collection(this.collectionName)
      .doc(uid)
      .update({ cart: FieldValue.delete() });
  }
}
