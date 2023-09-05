import companyModle from "../modles/company.js";
import UsersModle from "../modles/users.js";

class CompanyController{

    static async addService(request , response){
try{
    const {serviceName , quantity , price_Per_Unit} = request.body;

    const result = await companyModle.addNewService(serviceName , quantity , price_Per_Unit);

    if(result){
        response.status(200).json({
            "status":true,
            "message":"Success Add Service",
            "data":null
         });
    }else{
        response.status(401).json({
            "status":false,
            "message":"Unsuccess Add Service",
            "data":null
         });
    }
}catch(error){

    response.status(500).json({
        "status":false,
        "message":error,
        "data":null
     });

}

    }

    static async updateService(request , response){
        try{
            const {id , quantity , price_Per_Unit} = request.body;
            const result = await companyModle.updatePriceAndQuantityService(quantity , price_Per_Unit , id);
            if(result){
                response.status(200).json({
                    "status":true,
                    "message":"Success Update Service",
                    "data":result
                 });
            }else{
                response.status(401).json({
                    "status":false,
                    "message":"Unsuccess Update Service",
                    "data":null
                 });
            }
        }catch(error){
            response.status(500).json({
                "status":false,
                "message":error,
                "data":null
             });

        }
    }

}
export default CompanyController;