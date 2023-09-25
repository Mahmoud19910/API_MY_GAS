import express  from "express";
import driverController from "../controllers/driver_controller.js"

const driverRout = express.Router();


driverRout.get("/getAllDriver" , driverController.getAllDriver);
driverRout.get("/getDriverById" , driverController.getDriverById);

driverRout.get("/getAllOrderAvaliableById" , driverController.getOrderCompanyAvaliable);
driverRout.get("/getAllOrderCompany" , driverController.getAllOrderCompany);
driverRout.get("/getAllDriverNotificationById", driverController.getAllDriverNotification);
driverRout.put("/acceptedToOrderOrCancel" , driverController.acceptOrCancelOrder);
driverRout.get("/getAllUsersChatDriver", driverController.getAllUsersINChatDriver);
driverRout.post("/sendMessage", driverController.sendMessage);
driverRout.get("/getMessagesById", driverController.getMessagesById);
driverRout.delete("/deleteMessageById", driverController.deleteMessageById);









export default driverRout;