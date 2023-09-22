import mysql from "mysql"

const myDataBase = mysql.createPool({
    host: "localhost",
    user: "root",     // Replace with your MySQL username
    password: "",
    database:"my_gas_app_db"
});

myDataBase.getConnection(()=>{console.log("Success Connect To Data Base")});

export default myDataBase;