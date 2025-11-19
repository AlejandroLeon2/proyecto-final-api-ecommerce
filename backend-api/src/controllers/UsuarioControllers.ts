import type { Request, Response } from "express";
import { UserService } from "../services/UsuarioService.js";
import { User } from "../models/User.js";
import admin from "../config/dbFirebase.js";
import { CustomResponse } from "../utils/CustomResponse.js";

interface RequestUser extends Request {
  user: {
    uid: string;
    email: string;
    name?: string;
    picture?: string;
  };
}
export class UserControllers {
  private service: UserService;
  constructor(
    db: FirebaseFirestore.Firestore = admin.firestore(),
    coleccion: string = "usuario"
  ) {
    this.service = new UserService(db, coleccion);
  }

// --- NUEVO MÉTODO PARA REGISTRO ---
  public registrarUsuario = async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: "Datos incompletos (email, password, name son requeridos)" });
      }

      // 1. Llama al servicio para crear el usuario en Firebase Auth y Firestore
      const nuevoUsuario = await this.service.crearUsuarioConEmail(
        email,
        password,
        name
      );

      // 2. Devuelve una respuesta exitosa
      // Usamos 201 (Created)
      return res.status(201).json(
        CustomResponse.success(nuevoUsuario, "Usuario registrado exitosamente")
      );

    } catch (error: any) {
      console.error("Error al registrar usuario:", error);
      // Manejar errores comunes de Firebase
      if (error.code === 'auth/email-already-exists') {
        return res.status(409).json(CustomResponse.error(error.code, "El correo electrónico ya está en uso."));
      }
      return res.status(500).json(CustomResponse.error("INTERNAL_SERVER_ERROR", "Error interno del servidor"));
    }
  };

  public autenticarUsuario = async (req: Request, res: Response) => {
    try {
      const userUid = req as RequestUser;
      const user = userUid.user;

      if (!user || !user.uid || !user.email) {
        return res.status(400).json({ error: "Datos de usuario incompletos" });
      }
      const usuario = new User(
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

  // Obtener usuario por UID para ruta pública o protegida
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

  // Obtener rol de usuario autenticado
  public obtenerRolUsuario = async (req: Request, res: Response) => {
    try {
      // Obtener el uid del usuario autenticado desde res.locals
      const uid = res.locals.uid;
      // Verificar que el uid esté presente
      if (!uid) {
        return res.status(400).json({ error: "Falta el parámetro 'Uid'" });
      }
      // Obtener el rol del usuario
      const rol = await this.service.obtenerRol(uid);
      // Verificar que se haya encontrado un rol
      if (!rol) {
        return res.status(404).json({ error: "Rol no encontrado" });
      }
      // Enviar el rol en la respuesta
      res.status(200).json({ rol: rol });
    } catch (error) {
      console.error("Error al obtener rol de usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    } 
  }
}
