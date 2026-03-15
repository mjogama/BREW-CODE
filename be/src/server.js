import dotenv from "dotenv";
import asyncErrorHandler from "express-async-handler";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import express from "express";

import globalMiddleware from "./middlewares/globalMiddleware.js";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.route.js";
import orderRoute from "./routes/order.route.js";
import productRoute from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet());
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTION"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(compression());

app.use("/api/user", userRoute);
app.use("/api/order", orderRoute);
app.use("/api/product", productRoute);

app.use(globalMiddleware);

const serverStarter = asyncErrorHandler(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
  });
});

serverStarter();
