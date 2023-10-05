import mysql from "mysql"

const myDataBase = mysql.createPool({
    host: "srv505.hstgr.io",
    user: "u321857518_gaz",     // Replace with your MySQL username
    password: "e&W:mJJf$V7",
    database:"u321857518_gaz"
});

myDataBase.getConnection(()=>{console.log("Success Connect To Data Base")});

export default myDataBase;