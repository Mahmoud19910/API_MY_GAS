import express from "express";
import userController from "../controllers/user_controller.js"
import UsersModle from "../modles/users.js";


const userExpress = express.Router();

userExpress.get("/", userController.getUsers);
userExpress.post("/newUser" , userController.addNewUser);
userExpress.post("/loginByemailpass" , userController.loginUserByEmailPass);

// userExpress.post("/get-user-type", async (req, res) => {
//     const { email, pass } = req.body;
  
//     try {
//       const user = await UsersModle.getUserByCredentials(email, pass);
  
//       if (user) {
//         res.send(user.user_type.toString());
//       } else {
//         res.status(404).json({ message: "User not found" });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
// });
export default userExpress