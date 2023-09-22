import db from "../db.js"
class Driver{

    static async getDriver(){

        return new Promise((resolve , reject)=>{
            db.query("SELECT id , driver_name , lat_location , long_location FROM driver_account" , [] , (error , result)=>{
                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })
        })
    }

}export default Driver;