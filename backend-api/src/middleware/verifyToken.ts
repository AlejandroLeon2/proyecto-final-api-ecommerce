
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
