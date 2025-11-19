import type { Firestore } from "firebase-admin/firestore";
import { User } from "../models/User.js";

// Importa el 'admin' de tu configuración de dbFirebase
import admin from "../config/dbFirebase.js";

export class UserService {

  // Añade una propiedad para el servicio de Auth del Admin SDK
  private authAdmin = admin.auth();

  constructor(private db: Firestore, public coleccionNombre: string) {}

  // --- MÉTODO PARA CREAR USUARIO (AUTH + FIRESTORE) ---
  async crearUsuarioConEmail(email: string, pass: string, name: string): Promise<User> {
    
    // 1. Crear el usuario en Firebase Authentication
    const userRecord = await this.authAdmin.createUser({
      email: email,
      password: pass,
      displayName: name,
    });

    // 2. Preparar el objeto User para Firestore
    const { uid } = userRecord;
    const nuevoUsuario = new User(
      uid,
      email,
      name,
      userRecord.photoURL // Puede ser undefined
    );

    // 3. Guardar los datos del usuario en Firestore (reutilizando el método guardar)
    await this.guardar(nuevoUsuario);

    // 4. Devolver el usuario guardado
    return nuevoUsuario;
  }


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

  async obtenerRol(uid: string): Promise<string | null> {
    const doc = await this.db.collection(this.coleccionNombre).doc(uid).get();
    if (!doc.exists) return null;
    const data = doc.data();
    if (!data || !data.rol) return null;
    return data.rol;
  }
  
}
