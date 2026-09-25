import { Router } from "express";
import * as controller from "./catalog.controller.js";

export const catalogRouter = Router();

catalogRouter.get("/products", controller.listProducts);
catalogRouter.get("/products/:id", controller.getProduct);
