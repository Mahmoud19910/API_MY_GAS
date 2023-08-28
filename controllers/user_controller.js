import usersModle from "../modles/users.js";

class Userscontroller{

    // جلب جميع المستخدمين
    static async getUsers(request , response){
        const result = await usersModle.getAllusers();
        if(result){
            response.json(result);
        }else{
            response.status(404).send("Not found");
        }
    }

    // تسجيل مستخدم جديذ
    static async addNewUser(request , response){
        const result = await usersModle.addUsers(request.body.name , request.body.user_type , request.body.email , request.body.pass);
        if(result){
            response.send("Added New Users Success");
        }else{
            response.status(404).send("Not Found");
        }
    }


    // تسجيل الدخول
    static async loginUserByEmailPass(request , response){
        const { email, pass } = request.body;

        try {
            const user = await usersModle.getUserByCredentials(email, pass);
        
            if (user) {
                response.status(200).send(user.user_type.toString());
            } else {
                response.status(404).send( "User not found" );
            }
          } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal server error"    );
          }
    }

} export default Userscontroller;