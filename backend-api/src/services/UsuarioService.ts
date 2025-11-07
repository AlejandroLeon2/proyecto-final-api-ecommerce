import { Firestore } from "firebase-admin/firestore";
import { Usuario } from "../models/Usuario.js";

export class UsuarioService {
  constructor(private db: Firestore, public coleccionNombre: string) {}
  async guardar(usuario: Usuario): Promise<void> {
    await this.db
      .collection(this.coleccionNombre)
      .doc(usuario.uid)
      .set(usuario.toFirestore(), { merge: true });
  }

  async obtener(uid: string): Promise<Usuario | null> {
    const doc = await this.db.collection(this.coleccionNombre).doc(uid).get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (!data) return null;
    return new Usuario(
      uid,
      data.email,
      data.nombre,
      data.foto,
      data.rol,
      data.carrito
    );
  }
}
