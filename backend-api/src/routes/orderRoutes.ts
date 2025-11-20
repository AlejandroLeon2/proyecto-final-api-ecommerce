import { Router } from "express";
import { db } from "../config/firebase.js";
import { OrderController } from "../controllers/OrderController.js";

const router = Router();
const controllers = new OrderController(db);

router.post("/order", controllers.createOrder);
router.get("/order/all", controllers.getAllOrders);
router.get("/order/:id", controllers.getOrderById);
router.get("/order/user/:userId", controllers.getOrdersByUserId);
router.post("/order", controllers.createOrder);

export default router;
