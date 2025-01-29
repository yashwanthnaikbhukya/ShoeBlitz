import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors()
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//test route

app.get("/", (req, res) => {
  res.send("Working...");
});

// user router
import userRouter from "./routes/users.routes.js";
app.use("/api/v1/users", userRouter);

// product router
import productRouter from "./routes/product.routes.js";
app.use("/api/v1/products", productRouter);

// admin routes
import adminRouter from "./routes/admin.routes.js";
app.use("/api/v1/admin", adminRouter);

export default app;
