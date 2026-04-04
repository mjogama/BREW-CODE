import express from "express";

import * as userController from "../controllers/user.controller.js";
import authToken from "../middlewares/authToken.js";
import authRole from "../middlewares/authRole.js";
import {
	validateSignup,
	validateLogin,
	validateRetrieveCustomers,
	validateRetrieveUserData,
	validateRetrieveAdminData,
	validatePaginatedCustomers,
	validateDeleteCustomerData,
} from "../middlewares/schemaValidators/userValidator.js";

const router = express.Router();

router.post("/signup", validateSignup, userController.signupUser);
router.post("/login", validateLogin, userController.loginUser);
router.get("/customers", authToken, validateRetrieveCustomers, userController.retrieveCustomers);
router.get("/", authToken, authRole("customer"), validateRetrieveUserData, userController.retrieveUserData);
router.get("/admin", authToken, authRole("admin"), validateRetrieveAdminData, userController.retrieveAdminData);
router.get("/page", authToken, authRole("admin"), validatePaginatedCustomers, userController.retrievePaginatedUsers);
router.delete("/delete/:id", authToken, validateDeleteCustomerData, userController.deleteCustomerData);

export default router;
