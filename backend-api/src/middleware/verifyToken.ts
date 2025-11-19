
import admin from "../config/dbFirebase.js";
import type { Request, Response,NextFunction } from "express";
const auth= admin.auth();

interface RequestUser extends Request {
  user: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  };
}
export async function verifyToken(req:Request, res:Response, next:NextFunction) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });

  try {
    const decoded = await auth.verifyIdToken(token);
    const userUid = req as RequestUser;
    userUid.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

//middleware para proteger rutas y obtener el uid del usuario autenticado
export async function authGuard(req:Request, res:Response, next:NextFunction) {
  // Obtener el token de la cabecera Authorization
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });
  try {
    // verificamos el token
    const decoded = await auth.verifyIdToken(token);
    // guardamos el uid en res.locals para usarlo en el controlador
    res.locals.uid = decoded.uid
    next();
  } catch (err) {
    // controlamos errores de verificación del token
    return res.status(403).json({ error: 'Token inválido' });
  }
}