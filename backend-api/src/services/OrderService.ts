import {
  DocumentReference,
  Firestore,
  type DocumentData,
} from "firebase-admin/firestore";
import type { Order } from "../interface/IOrders.js";
export class OrderService {
  constructor(public db: Firestore, public collectionName: string) {}

  async getAllOrders(): Promise<Order[]> {
    const snapshot = await this.db.collection(this.collectionName).get();

    const orders = snapshot.docs.map((item) => {
      const data = item.data();
      return {
        id: item.id,
        userId: data.userId,
        items: data.items,
        address: data.address,
        total: data.total,
        createdAt: data.createdAt,
      };
    });

    // Get users ref
    const usersRef: {
      [key: string]: DocumentReference<DocumentData, DocumentData>;
    } = {};
    const usersIds: string[] = [];

    for (const order of orders) {
      if (usersRef[order.userId]) continue;
      usersRef[order.userId] = this.db.collection("usuario").doc(order.userId);
      usersIds.push(order.userId);
    }

    const usersSnapshots = await this.db.getAll(...Object.values(usersRef));
    const users = usersSnapshots.reduce((acc, user) => {
      const data = user.data();
      if (!data) return acc;

      acc[user.id] = { name: data.nombre, email: data.email };
      return acc;
    }, {} as { [key: string]: { name: string; email: string } });

    return orders.map((order) => ({
      ...order,
      user: users[order.userId] as { name: string; email: string },
    }));
  }

  async getOrderById(id: string): Promise<Order | null> {
    const orderSnap = await this.db
      .collection(this.collectionName)
      .doc(id)
      .get();

    if (!orderSnap.exists) return null;

    const data = orderSnap.data();
    if (!data) return null;

    return {
      id: orderSnap.id,
      userId: data.userId,
      items: data.items,
      address: data.address,
      total: data.total,
      createdAt: data.createdAt,
    };
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const snapshot = await this.db
      .collection(this.collectionName)
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map((item) => ({
      id: item.id,
      userId: item.data().userId,
      items: item.data().items,
      address: item.data().address,
      total: item.data().total,
      createdAt: item.data().createdAt,
    }));
  }

  async createOrder(order: Order): Promise<Order> {
    // Firestore asigna ID automáticamente
    const createdAt = Date.now();

    const docRef = await this.db.collection(this.collectionName).add({
      userId: order.userId,
      items: order.items,
      address: order.address,
      total: order.total,
      createdAt,
    });

    const newDoc = await docRef.get();

    return {
      id: newDoc.id,
      ...newDoc.data(),
    } as Order;
  }
}
