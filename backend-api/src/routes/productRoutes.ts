import { Router } from "express"
import { ProductControllers } from "../controllers/ProductControllers.js"

const router= Router();
const controllers = new ProductControllers ();

router.post('/product',controllers.createProductController);
router.get('/product/all',controllers.getAllProductsController);
router.get('/product/:id',controllers.getProductsController);
router.put('/product/:id',controllers.updateProductController);
router.delete('/product/:id',controllers.deleteProductController);
export default router;