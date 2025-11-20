import type { Request, Response } from "express";
import type { Firestore } from "firebase-admin/firestore";
import { OrderService } from "../services/OrderService.js";
import { CustomResponse } from "../utils/CustomResponse.js";

export class OrderController {
  private service: OrderService;

  constructor(db: Firestore) {
    this.service = new OrderService(db, "orders");
  }

  // GET /orders
  getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await this.service.getAllOrders();

      return res
        .status(200)
        .json(CustomResponse.success(orders, "Orders fetched successfully"));
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res
        .status(500)
        .json(CustomResponse.error("O001", "Error fetching orders"));
    }
  };

  // GET /orders/:id
  getOrderById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          ok: false,
          message: "Order ID is required",
        });
      }
      const order = await this.service.getOrderById(id);

      if (!order) {
        return res.status(404).json({
          ok: false,
          message: "Order not found",
        });
      }

      return res.status(200).json({
        ok: true,
        order,
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({
        ok: false,
        message: "Error fetching order",
      });
    }
  };

  getOrdersByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res
          .status(400)
          .json(CustomResponse.error("O002", "User ID is required"));
      }
      const orders = await this.service.getOrdersByUserId(userId);

      return res
        .status(200)
        .json(CustomResponse.success(orders, "Orders fetched successfully"));
    } catch (error) {
      console.error("Error fetching orders by user ID:", error);
      return res
        .status(500)
        .json(CustomResponse.error("O003", "Error fetching orders by user ID"));
    }
  };

  // POST /orders
  createOrder = async (req: Request, res: Response) => {
    try {
      const newOrder = req.body;

      const created = await this.service.createOrder(newOrder);

      return res.status(201).json({
        ok: true,
        message: "Order created",
        order: created,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({
        ok: false,
        message: "Error creating order",
      });
    }
  };
}
