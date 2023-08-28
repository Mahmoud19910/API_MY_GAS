import express from "express"
import usersRoute from "./routes/users_routes.js"

const appExpress = express();
const port = process.env.port || 3500;
appExpress.use(express.json()); // Use express.json() middleware to parse JSON data

appExpress.use("/user" , usersRoute);

appExpress.listen(port , ()=>console.log("Runing on port num   "+port));