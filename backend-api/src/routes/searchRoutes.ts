import Router from "express";
import { searchController } from "../controllers/searchComtroller.js";

const router = Router();
const controllers = new searchController();

router.get("/search/product", controllers.searchProducts);

// query completa ejemplo : http://localhost:3000/v1/search/product?data=textoBuscado
export default router;