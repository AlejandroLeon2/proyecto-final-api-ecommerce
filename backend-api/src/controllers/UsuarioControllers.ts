import type { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService.js";
import { Usuario } from "../models/Usuario.js";
import admin from "../config/dbFirebase.js";

interface RequestUser extends Request {
  user: {
    uid: string;
    email: string;
    name?: string;
    picture?: string;
  };
}

export class UsuarioControllers {
  private service: UsuarioService;
  constructor(
    db: FirebaseFirestore.Firestore = admin.firestore(),
    coleccion: string = "usuario"
  ) {
    this.service = new UsuarioService(db, coleccion);
  }

  public autenticarUsuario = async (req: Request, res: Response) => {
    try {
      const userUid = req as RequestUser;
      const user = userUid.user;

      if (!user || !user.uid || !user.email) {
        return res.status(400).json({ error: "Datos de usuario incompletos" });
      }
      const usuario = new Usuario(
        user.uid,
        user.email,
        user.name,
        user.picture
      );

      await this.service.guardar(usuario);

      res.status(200).json({
        mensaje: "Usuario autenticado y guardado",
      });

    } catch (error) {
      console.error("Error al autenticar usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  public obtenerUsuarioPorUid = async (req: Request, res: Response) => {
    try {
      const uid = req.params.uid;
      if (!uid) {
        return res.status(400).json({ error: "Falta el parámetro 'Uid'" });
      }
      const usuario = await this.service.obtener(uid);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
