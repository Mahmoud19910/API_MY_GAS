import express from "express";
import db from "../db.js"
import { resolve } from "path";
import { error } from "console";

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
    static async addClient(name , user_type , email , pass , verificationCode){
        return new Promise((resolve , reject)=>{

            db.query("insert into users_info (name , user_type , email , pass , verificationCode) values (?,?,?,?,?) " , [name , user_type , email , pass , verificationCode] , (error , result)=>{
                if(!error){
                    resolve(result);
                }else{
                    reject(error);
                }
            });
        });
    }

    // انشا حساب سائق 
    static async addDriver(name , user_type , email , pass , verificationCode , vehicle_number , phone ,  lat_location , long_location){
        return new Promise((resolve , reject)=>{

            db.query("insert into driver_account (name , user_type , email , pass , verificationCode , vehicle_number , phone ,  lat_location , long_location) values (?,?,?,?,?,?,?,?,?) " , [name , user_type , email , pass , verificationCode , vehicle_number , phone ,  lat_location , long_location] , (error , result)=>{
                if(!error){
                    resolve(result);
                }else{
                    reject(error);
                }
            });
        });
    }

    // انشا حساب شركة 
    static async addCompany(name , user_type , email , pass , company_registration_number  , phone ,  lat_location , long_location , verificationCode){
        return new Promise((resolve , reject)=>{

            db.query("insert into  company_account (name , user_type , email , pass , company_registration_number  , phone ,  lat_location , long_location , verificationCode) values (?,?,?,?,?,?,?,?,?) " , [name , user_type , email , pass , company_registration_number , phone ,  lat_location , long_location , verificationCode] , (error , result)=>{
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
                    "SELECT user_type FROM users_info WHERE email = ? AND pass = ?",
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
                    "SELECT user_type FROM company_account WHERE email = ? AND pass = ?",
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
                    "SELECT user_type FROM driver_account WHERE email = ? AND pass = ?",
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

    static async getUserByIdToVerifyAccount(email) {
        return new Promise((resolve, reject) => {
            db.query("SELECT * FROM users_info WHERE email = ?", [email], (error, result) => {
                if (!error) {
                    resolve(result[0]);
                } else {
                    reject(error);
                }
            });
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