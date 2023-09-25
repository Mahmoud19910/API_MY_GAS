import express from "express";
import db from "../db.js"
import { resolve } from "path";
import { error } from "console";
import { rejects } from "assert";

class UsersModle{

        // جلب بيانات العميل
    static async getClientUsers(){

        return new Promise((resolve , reject)=>{

            db.query("select * from users_info" , [] , (error , result)=>{

                if(!error){
                    resolve(result);
                }else{
                    reject(error);
                }
            });
        });
    }
    // جلب بيانات الشركة
    static async getCompanyUsers(){

        return new Promise((resolve , reject)=>{

            db.query("select * from company_account" , [] , (error , result)=>{

                if(!error){
                    resolve(result);
                }else{
                    reject(error);
                }
            });
        });
    }

    // جلب بيانات السائقين
    static async getDriverUsers(){

        return new Promise((resolve , reject)=>{

            db.query("select * from driver_account" , [] , (error , result)=>{

                if(!error){
                    resolve(result);
                }else{
                    reject(error);
                }
            });
        });
    }

    // انشا حساب عميل 
    static async addClient(id , name , user_type , email , pass , verificationCode , address , phone , client_lat_location , client_long_location){
        return new Promise((resolve , reject)=>{

            db.query("insert into users_info (id , name , user_type , email , pass , verificationCode , phone , image , client_address  , client_lat_location , client_long_location) values (?,?,?,?,?,?,?,?,?,?,?) " , [id , name , user_type , email , pass , verificationCode , phone , "" , address  , client_lat_location , client_long_location] , (error , result)=>{
                if(!error){
                    resolve(result);
                }else{
                    reject(error);
                }
            });
        });
    }

    // انشا حساب سائق 
    static async addDriver(id , name , user_type , email , pass , verificationCode , vehicle_number , phone ,  lat_location , long_location , driver_address){
        return new Promise((resolve , reject)=>{

            db.query("insert into driver_account (id , driver_name , user_type , email , pass , verificationCode , vehicle_number , phone ,  driver_lat_location , driver_long_location , evaluations , orders_number , image , driver_address) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?) " , [id , name , user_type , email , pass , verificationCode , vehicle_number , phone ,  lat_location , long_location , 0 , 0 , "" , driver_address] , (error , result)=>{
                if(!error){
                    resolve(result);
                }else{
                    reject(error);
                }
            });
        });
    }

    // انشا حساب شركة 
    static async addCompany(id , name , user_type , email , pass , company_registration_number  , phone ,  lat_location , long_location , verificationCode , address){
        return new Promise((resolve , reject)=>{

            db.query("insert into  company_account (id , company_name , user_type , email , pass , company_registration_number  , phone ,  lat_location , long_location , verificationCode , evaluations , orders_number , image , address) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?) " , [id , name , user_type , email , pass , company_registration_number , phone ,  lat_location , long_location , verificationCode , 0 , 0 ,"" , address] , (error , result)=>{
                if(!error){
                    resolve(result);
                }else{
                    reject(error);
                }
            });
        });
    }

    static async loginUsersByEmailPass(email, pass , user_type) {
        return new Promise((resolve, reject) => {
        
            if(user_type === "client"){
                db.query(
                    "SELECT * FROM users_info WHERE email = ? AND pass = ?",
                    [email, pass],
                    (error, result) => {
                      console.log('error : '+error+', result : '+result)
                      if (!error && result.length > 0) {
                        resolve(result[0]);
        
                      } else {
                        console.log(result)
                        console.log(error)
                        reject(error);
                      }
                    }
                  );
            }
            else
            if(user_type === "company"){
                db.query(
                    "SELECT * FROM company_account WHERE email = ? AND pass = ?",
                    [email, pass],
                    (error, result) => {
                      if (!error && result.length > 0) {
                        resolve(result[0]);
                        console.log('error : '+error+', comany : '+result)
        
                      } else {
                        console.log(result)
                        console.log(error)
                        reject(error);
                        console.log('error : '+error+', comany2 : '+result)
                      }
                    }
                  );
            }
            else
            if(user_type === "driver"){
                db.query(
                    "SELECT * FROM driver_account WHERE email = ? AND pass = ?",
                    [email, pass],
                    (error, result) => {
                      console.log('error : '+error+', result : '+result)
                      if (!error && result.length > 0) {
                        resolve(result[0]);
        
                      } else {
                        console.log(result)
                        console.log(error)
                        reject(error);
                      }
                    }
                  );
            }
        });
    }

    static async getUserByIdToVerifyAccount(email , user_type) {
        return new Promise((resolve, reject) => {

            if(user_type === "company"){
                db.query("SELECT * FROM company_account WHERE email = ?", [email], (error, result) => {
                    if (!error) {
                        console.log(`Data Badse email ${result[0]}`)
                        resolve(result[0]);
                    } else {
                        reject(error);
                    }
                });
            }
            else
            if(user_type === "driver"){
                db.query("SELECT * FROM driver_account WHERE email = ?", [email], (error, result) => {
                    if (!error) {
                        console.log(`Data Badse email ${result[0]}`)
                        resolve(result[0]);
                    } else {
                        reject(error);
                    }
                });
            }
            else
            if(user_type === "client"){
                db.query("SELECT * FROM users_info WHERE email = ?", [email], (error, result) => {
                    if (!error) {
                        console.log(`Data Badse email ${result[0]}`)
                        resolve(result[0]);
                    } else {
                        reject(error);
                    }
                });
            }
         
        });
    }
    

    static async updatePasswordInDataBase(email , pass , user_type , verificationCode){

        return new Promise((resolve , reject)=>{
            try{

                if(user_type === "company"){

                    db.query("SELECT * FROM company_account WHERE email=?" , [email] , (error , result)=>{
                        if(!error && result.length > 0){
                            db.query("UPDATE company_account SET pass=? , verificationCode=? WHERE email=?" , [pass , verificationCode , email] , (error , result)=>{
                                if(!error){
                                    console.log("Result Company : "+ result)
                                    resolve(result);
                                }else{
                                    console.log("Error Company : "+ error)
                                    reject(error);
                                }
                            });
                        }else{
                            console.log("Error  :"+ error);
                            reject(error);
                        }
                    });
                   
                }
                else
                if(user_type === "client"){

                    // جلب البيانات من جدول الزبائن للتحقق من وجود الايميل
                    db.query("SELECT * FROM users_info WHERE email=?", [email], (error, result) => {
                        console.log(error);

                        if(!error && result.length > 0){ // ادا كان يوجد نتيجة يتم تعديل كلمة المرور
                            db.query("UPDATE users_info SET pass=? , verificationCode=? WHERE email=?" , [pass , verificationCode , email] , (error , result)=>{
                                if(!error){
                                    console.log("Success Check  :"+ result)
                                    resolve(result);
                                }else{
                                    reject(error);
                                }
                            });
                        }else{
                            console.log("Error  :"+ error);
                            reject(error);
                        }
                    });
                 
                }
                else
                if(user_type === "driver"){
                    db.query("SELECT * FROM driver_account WHERE email=?" , [email] , (error , result)=>{

                        if(!error && result.length>0){
                            db.query("UPDATE driver_account SET pass=? , verificationCode=? WHERE email=?" , [pass , user_type ,verificationCode , email] , (error , result)=>{
                                if(!error){
                                    resolve(result);
                                }else{
                                    reject(error);
                                }
                            });

                        }else{
                            reject(error);
                        }
                    })
                  
                }
               
            }catch(e){
                console.log("Error in data base "+e)
            }

          
        });
    }

    // تعديل بيانات المستخدم
    static async updateClientInfo(name , image , phone , email , id){

        return new Promise((resolve , reject)=>{

            db.query("UPDATE users_info SET name=? , image=? , phone=? , email=? WHERE id=?" , [name , image , phone , email , id] , (error , result)=>{

                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })
        })
    }

    static async updateClientlocation(lat_client , long_client , address , id){

        return new Promise((resolve , reject)=>{

            db.query("UPDATE users_info SET client_address=? , client_lat_location=? , client_long_location=? WHERE id=?" , [lat_client , long_client , address , id] , (error , result)=>{

                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })
        })
    }

    static async getUserById(id , user_type){
        return new Promise((resolve , reject)=>{
            
            if(user_type === "driver"){

                db.query("SELECT driver_name , id , user_type FROM driver_account WHERE id=?" , [id] , (error , result)=>{
                    if(!error){
                        resolve(result)
                    }else{
                        reject(error)
                    }
                })
                
            }
            else
            if(user_type === "company"){

                db.query("SELECT company_name , id , user_type FROM company_account WHERE id=?" , [id] , (error , result)=>{
                    if(!error){
                        resolve(result)
                    }else{
                        reject(error)
                    }
                })
            }
            else
            if(user_type === "client"){

                db.query("SELECT name , id , user_type FROM users_info WHERE id=?" , [id] , (error , result)=>{
                    if(!error){
                        resolve(result)
                    }else{
                        reject(error)
                    }
                })
            }else{
                
            }
        })
    }

    static async getUserFromchatandDriverById(id , user_type){
        return new Promise((resolve , reject)=>{
            
            if(user_type === "driver"){

                db.query("SELECT chat.*, driver_account.* FROM chat INNER JOIN driver_account ON chat.sender_id = ? OR chat.reciver_id = ? WHERE chat.sender_id = ? OR chat.reciver_id = ? LIMIT 0, 25;" , [id , id , id , id] , (error , result)=>{
                    if(!error){
                        resolve(result)
                    }else{
                        reject(error)
                    }
                })

            }
            else
            if(user_type === "company"){

                db.query("SELECT chat.*, company_account.* FROM chat INNER JOIN company_account ON chat.sender_id = ? OR chat.reciver_id = ? WHERE chat.sender_id = ? OR chat.reciver_id = ? LIMIT 0, 25;" , [id , id , id , id] , (error , result)=>{
                    if(!error){
                        resolve(result)
                    }else{
                        reject(error)
                    }
                })
            }
            else
            {

            }
        })
    }

    static async updateCompany(image , company_registration_number  , address , email , company_name , id , phone){

        return new Promise((resolve , reject)=>{

            db.query("UPDATE company_account SET image=? , company_registration_number=?	, address=? , email=? , company_name=? phone=? WHERE id=?" ,
             [image , company_registration_number  , address , email , company_name , phone , id] ,(error , result)=>{

                if(!error){

                    resolve(result)
                }else{
                    reject(error)
                }
            })
        })
    }

    static async updateDriverlocation(lat_client , long_client  , id){

        return new Promise((resolve , reject)=>{

            db.query("UPDATE driver_account SET  driver_lat_location=? , driver_long_location=? WHERE id=?" , [lat_client , long_client , id] , (error , result)=>{

                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })
        })
    }


    static async updateDriver(driver_name , email , vehicle_number , phone , image , driver_address , id){

        return new Promise((resolve , reject)=>{

            db.query("UPDATE driver_account SET driver_name=? , email=?	, vehicle_number=? , phone=? , image=? ,  driver_address=? WHERE id=?" ,
             [driver_name , email , vehicle_number , phone , image , driver_address , id] ,(error , result)=>{

                if(!error){

                    resolve(result)
                }else{
                    reject(error)
                }
            })
        })
    }
    // static async updateVerifyCode(verificationCode , email){
    //     return new Promise ((resolve , reject)=>{
    //         db.query("UPDATE users_info SET verificationCode=? WHERE email=?" , [verificationCode , email] , (error , result)=>{
    //             if(!error){
    //                 resolve(result);
    //                 console.log("Success update"+ result)

    //             }else{
    //                 console.log("Error update"+ error)

    //                 reject(error);

    //             }
    //         })
    //     })
    // }

}
export default UsersModle