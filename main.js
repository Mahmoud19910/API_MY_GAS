import express from "express"
import http from 'http'; // Node.js built-in module for creating an HTTP server
import { Server } from 'socket.io';
import usersRoute from "./routes/users_routes.js"
import companyRoute from "./routes/company_routes.js"
import clientRoutes from "./routes/client_routes.js"
import ClientController from "./controllers/client_controller.js";
import Userscontroller from "./controllers/user_controller.js";


const appExpress = express();
const server = http.createServer(appExpress); // Create an HTTP server
const io = new Server(server); 

ClientController.setIO(io);

const port = process.env.port || 3500;

appExpress.use(express.json()); // Use express.json() middleware to parse JSON data
appExpress.use("/user" , usersRoute);
appExpress.use("/company" , companyRoute);
appExpress.use("/client" , clientRoutes);



server.listen(port , ()=>console.log("Runing on port num   "+port));