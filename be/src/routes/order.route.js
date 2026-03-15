import express from "express";

import * as orderController from "../controllers/order.controller.js";
import authToken from "../middlewares/authToken.js";
import {
  validateNewOrder,
  validateTotalCustomersOrder,
  validateTotalRevenue,
  validateUpdateOrderStatusById,
  validateDeleteOrder,
} from "../middlewares/schemaValidators/orderValidator.js";

const router = express.Router();

router.post("/new", authToken, validateNewOrder, orderController.newCustomer);
router.get("/", authToken, orderController.retrieveOrders);
router.get("/totalOrders", authToken, validateTotalCustomersOrder, orderController.totalCustomersOrder);
router.get("/revenue", authToken, validateTotalRevenue, orderController.totalRevenue);
router.patch("/update/:id", authToken, validateUpdateOrderStatusById, orderController.updateCustomerOrderById);
router.delete("/delete/:id", authToken, validateDeleteOrder, orderController.deleteCustomersOrder);

export default router;
