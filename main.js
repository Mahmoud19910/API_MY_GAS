import express from "express"
import usersRoute from "./routes/users_routes.js"

const appExpress = express();
const PORT = process.env.PORT || 3500; // Use the provided port or default to 3500
appExpress.use(express.json()); // Use express.json() middleware to parse JSON data

appExpress.use("/user" , usersRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });