// config/firebase.ts
import admin from "firebase-admin";

// Exporta solo Firestore reutilizando el app existente
export const db = admin.firestore();
