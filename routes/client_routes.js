import express from "express";
import clientController from "../controllers/client_controller.js";
import clientModle from "../modles/client.js";

const clientExpress = express.Router();
clientExpress.post("/newOrder" , clientController.newOrder);
clientExpress.get("/getOrderById", clientController.getOrderById);
clientExpress.get("/getOrderClientById", clientController.getClientorderByID);
clientExpress.get("/getAllOrder", clientController.getAllOrder);
clientExpress.get("/getAllUsersChat", clientController.getAllUsersINChat);
clientExpress.post("/sendMessage", clientController.sendMessage);

clientExpress.post("/getMessagesById", clientController.getMessagesById);
clientExpress.delete("/deleteMessageById/:id", clientController.deleteMessageById);
clientExpress.put("/evaluationsDriver", clientController.evaluationsDriver);

clientExpress.get("/getClientNotification", clientController.getAllClientNotification);




export default clientExpress;