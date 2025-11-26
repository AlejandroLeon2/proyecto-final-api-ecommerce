import Router from "express";
import { searchController } from "../controllers/searchComtroller.js";

const router = Router();
const controllers = new searchController();

// Rutas de búsqueda de productos por keyUp
router.get("/search/product", controllers.searchProducts);
// ruta para paginación y filtro de categorías
router.get("/search/paginated", controllers.getPaginatedProducts);



export default router;