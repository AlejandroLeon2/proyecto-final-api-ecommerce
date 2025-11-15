import { Router } from "express";
import { CartControllers } from "../controllers/CartControllers.js";

const router = Router();
const controllers = new CartControllers();

router.post("/cart", controllers.createCart);
router.get("/cart/:uid", controllers.getCartEnriched);
router.put("/cart", controllers.updateCart);
router.delete("/cart/:uid", controllers.deleteCart);

export default router;
