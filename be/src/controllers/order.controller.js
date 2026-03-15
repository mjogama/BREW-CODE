import asyncErrorHandler from "express-async-handler";

import * as orderService from "../services/order.service.js";
import ResponseHandler from "../helpers/ResponseHandler.js";

export const newCustomer = asyncErrorHandler(async (req, res) => {
  const { userId, purchasedProducts, totalAmount } = req.data;

  const purchasedInfo = {
    userId,
    purchasedProducts,
    totalAmount,
  };

  await orderService.newOrder(purchasedInfo);

  ResponseHandler(res, "success", 201, {
    message: "Purchased successfully!",
    purchasedData: null,
  });
});

export const retrieveOrders = asyncErrorHandler(async (req, res) => {
  const orders = await orderService.retrieveOrders();

  ResponseHandler(res, "success", 200, {
    message: "Retrieve data successfully!",
    orders,
  });
});

export const totalCustomersOrder = asyncErrorHandler(async (req, res) => {
  const totalOrders = req.data;

  ResponseHandler(res, "success", 200, {
    message: "Retrieve data successfully!",
    totalOrders,
  });
});

export const totalRevenue = asyncErrorHandler(async (req, res) => {
  const revenue = req.data;

  ResponseHandler(res, "success", 200, {
    message: "Retrieve data successfully!",
    revenue,
  });
});

export const updateCustomerOrderById = asyncErrorHandler(async (req, res) => {
  const { id } = req.data;

  console.log(req.body);
  const result = await orderService.updateOrderStatus(id, req.body);

  ResponseHandler(res, "success", 200, {
    message: "Updated data successfully!",
    result,
  });
});

export const deleteCustomersOrder = asyncErrorHandler(async (req, res) => {
  const { id } = req.data;

  const result = await orderService.deleteOrder(id);

  ResponseHandler(res, "sucess", 200, {
    message: "Deleted data successfully!",
    result,
  });
});
