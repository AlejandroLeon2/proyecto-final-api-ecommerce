import { Timestamp } from "firebase-admin/firestore";
import type { IStatus } from "./IStatus.js";

export interface ICategory {
  id: string;
  name: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: IStatus;
}
