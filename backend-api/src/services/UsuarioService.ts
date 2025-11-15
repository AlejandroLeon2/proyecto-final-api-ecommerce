import type { Firestore } from "firebase-admin/firestore";
import { User } from "../models/User.js";

export class UserService {
  constructor(private db: Firestore, public coleccionNombre: string) {}
  async guardar(usuario: User): Promise<void> {
    const docRef = this.db.collection(this.coleccionNombre).doc(usuario.uid);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      await docRef.set(usuario.toFirestore());
    }
  }

  async obtener(uid: string): Promise<User | null> {
    const doc = await this.db.collection(this.coleccionNombre).doc(uid).get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (!data) return null;
    return new User(
      uid,
      data.email,
      data.nombre,
      data.foto,
      data.rol
    );
  }
  
}
