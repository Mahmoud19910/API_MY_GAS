import express from "express";
import companyController from "../controllers/company_controller.js";
import companyModle from "../modles/company.js";

const companyExpress = express.Router();

companyExpress.post("/addService" , companyController.addService);
companyExpress.put("/updateService" , companyController.updateService);
companyExpress.get("/getOrderAvaliableFromClient" , companyController.getOrderClientAvaliable);
companyExpress.get("/getAllOrderClient" , companyController.getAllOrderClient);
companyExpress.get("/getOrderClientDetails" , companyController.getOrderClientDetail);
companyExpress.put("/acceptedToOrderOrCancel" , companyController.acceptOrCancelOrder);
companyExpress.post("/addDriverToMyFav" , companyController.addDriverToCompanyList);
companyExpress.get("/getCompanyDriver" , companyController.getCompanyDrivers);
companyExpress.delete("/deleteCompanyDriverById" , companyController.deleteDriverById);
companyExpress.get("/searchForDriver" , companyController.searchForDriver);
companyExpress.post("/showDetailsDriverOnclickTheDriverLocation" , companyController.showDriverDetailsOnclickTheLocation); // عند ضغط الشركة على موقع السائق يظهر المسافة و الوقت في bottom sheet
companyExpress.post("/sendNewOrderToDriver" , companyController.newOrderToDriver);
companyExpress.get("/getAllUsersChatCompany", companyController.getAllUsersINChatCompany);










export default companyExpress;