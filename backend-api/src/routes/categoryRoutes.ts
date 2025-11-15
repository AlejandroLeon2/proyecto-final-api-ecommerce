import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController.js";

const router = Router();
const controllers = new CategoryController();

router.post("/category", controllers.createCategory);
router.get("/category/all", controllers.getAllCategories);
router.get("/category/:id", controllers.getCategory);
router.put("/category/:id", controllers.updateCategory);
router.delete("/category/:id", controllers.deleteCategory);
export default router;
