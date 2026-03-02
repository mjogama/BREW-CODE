import express from "express";

import * as orderController from "../controllers/order.controller.js";
import authToken from "../middlewares/authToken.js";
import { validateNewOrder } from "../middlewares/schemaValidators/orderValidator.js";

const router = express.Router();

router.post("/new", authToken, validateNewOrder, orderController.newCustomer);

export default router;
