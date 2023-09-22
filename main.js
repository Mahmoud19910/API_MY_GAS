import express from "express"
import http from 'http'; // Node.js built-in module for creating an HTTP server
import { Server } from 'socket.io';
import usersRoute from "./routes/users_routes.js"
import companyRoute from "./routes/company_routes.js"
import clientRoutes from "./routes/client_routes.js"
import driverRoutes from "./routes/driver_routes.js"
import ClientController from "./controllers/client_controller.js";
import Userscontroller from "./controllers/user_controller.js";
import CompanyController from "./controllers/company_controller.js";


const appExpress = express();
const server = http.createServer(appExpress); // Create an HTTP server
const io = new Server(server); 

ClientController.setIO(io);
CompanyController.setIo(io);

const port = process.env.port || 4000;

appExpress.use(express.json()); // Use express.json() middleware to parse JSON data
appExpress.use("/user" , usersRoute);
appExpress.use("/company" , companyRoute);
appExpress.use("/client" , clientRoutes);
appExpress.use("/driver" , driverRoutes);



server.listen(port , ()=>console.log("Runing on port num   "+port));