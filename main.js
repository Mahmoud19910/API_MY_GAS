import cors from "cors";
import express from "express";
import http from 'http';
import path from 'path'; // Import the path module
import { Server } from 'socket.io';
import usersRoute from "./routes/users_routes.js";
import companyRoute from "./routes/company_routes.js";
import clientRoutes from "./routes/client_routes.js";
import driverRoutes from "./routes/driver_routes.js";
import ClientController from "./controllers/client_controller.js";
import Userscontroller from "./controllers/user_controller.js";
import CompanyController from "./controllers/company_controller.js";
import Company from "./modles/company.js";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const appExpress = express();
const server = http.createServer(appExpress);
const io = new Server(server);

// Optional: Enable socket logic when needed
// io.on('connection', (socket) => {
//   console.log('User connected');
//   console.log("Reciver Why Null")
//   console.log(187409233);
//   socket.on(`chat${187409233}` , (msg) => {
//     io.emit(`chat${187409233}`, msg); 
//   });
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

global.__basedir = __dirname;
global.uploadImageBaseUrl = 'http://srv505.hstgr.io:4000/user/files/';

var corsOptions = {
  origin: "http://srv505.hstgr.io:4000",
};

appExpress.use(cors(corsOptions));
appExpress.use(express.urlencoded({ extended: true }));
appExpress.use(express.json());

ClientController.setIO(io);
CompanyController.setIo(io);
Company.setIo(io);

// ✅ FIX: Use uppercase PORT (Render uses this)
const port = process.env.PORT || 4000;

appExpress.use("/user", usersRoute);
appExpress.use("/company", companyRoute);
appExpress.use("/client", clientRoutes);
appExpress.use("/driver", driverRoutes);

// ✅ Final listen line for Render compatibility
server.listen(port, () => console.log("✅ Running on port num " + port));
