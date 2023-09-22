import express from "express";
import userController from "../controllers/user_controller.js"
import UsersModle from "../modles/users.js";


const userExpress = express.Router();

userExpress.get("/getClient", userController.getClient);
userExpress.get("/getCompany", userController.getCompany);
userExpress.get("/getDriver", userController.getDriver);


userExpress.post("/signUpClientaccount" , userController.addClientAccount);
userExpress.post("/signUp-Driver-Account" , userController.addDriverAccount);
userExpress.post("/signUp-Company-Account" , userController.addCompanyAccount);

userExpress.post("/loginUserBy_Email&Pass" , userController.loginUserByEmailPass);
userExpress.post("/checkEmailVerify" , userController.checkTheCodeIsVerified);
userExpress.post("/reSendVerificationCode" , userController.reSendverificationCode);
userExpress.post("/updatePassword" , userController.updatePassowrd);

userExpress.put("/updateUserinfo" , userController.updateUserInfo);
userExpress.put("/updateCompanyInfo" , userController.updateCompanyInfo);
userExpress.put("/updateClientLocation" , userController.upDateClientlocation);






export default userExpress