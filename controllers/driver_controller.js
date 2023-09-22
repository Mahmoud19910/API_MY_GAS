import driver from "../modles/driver.js"

class DriverController{
    static async getAllDriver(request , response){

        try{
            const result = await driver.getDriver();

            if(result){
                response.status(200).json({
                    status: true,
                    message: "Success",
                    data: result,
                });
            }else{
                response.status(401).json({
                    status: false,
                    message: "Un Success",
                    data: null,
                });
            }
        }catch(error){
            response.status(500).json({
                status: false,
                message: error,
                data: null,
            });

        }
       
    }

}
export default DriverController;