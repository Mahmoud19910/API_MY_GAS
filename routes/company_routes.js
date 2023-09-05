import express from "express";
import companyController from "../controllers/company_controller.js";
import companyModle from "../modles/company.js";

const companyExpress = express.Router();

companyExpress.post("/addService" , companyController.addService);
companyExpress.put("/updateService" , companyController.updateService);

export default companyExpress;