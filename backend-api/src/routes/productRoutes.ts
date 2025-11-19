import { Router } from "express";
import multer from "multer";
import { ProductControllers } from "../controllers/ProductControllers.js";

// Middleware de Multer para manejo de imágenes
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
const controllers = new ProductControllers();

router.post(
  "/product",
  upload.single("image"),
  controllers.createProductController
);
router.get("/product/all", controllers.getAllProductsController);
router.get("/product/:id", controllers.getProductsController);
router.put(
  "/product/:id",
  upload.single("image"),
  controllers.updateProductController
);
router.get("/products/paginated", controllers.getPaginatedProductsController);
router.delete("/product/:id", controllers.deleteProductController);

router.get("/products/search", controllers.searchProductsController);
export default router;
