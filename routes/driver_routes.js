import express  from "express";
import driverController from "../controllers/driver_controller.js"

const driverRout = express.Router();


driverRout.get("/getAllDriver" , driverController.getAllDriver);

export default driverRout;