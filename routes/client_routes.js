import express from "express";
import clientController from "../controllers/client_controller.js";
import clientModle from "../modles/client.js";

const clientExpress = express.Router();
clientExpress.post("/newOrder" , clientController.newOrder);
clientExpress.get("/getOrderById/:order_num", clientController.getOrderById);

export default clientExpress;