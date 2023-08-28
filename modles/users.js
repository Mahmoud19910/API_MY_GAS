import express from "express";
import db from "../db.js"

class UsersModle{

    static async getAllusers(){

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

    static async addUsers(name , user_type , email , pass){
        return new Promise((resolve , reject)=>{

            db.query("insert into users_info (name , user_type , email , pass) values (?,?,?,?) " , [name , user_type , email , pass] , (error , result)=>{
                if(!error){
                    resolve(result);
                }else{
                    reject(error);
                }
            });
        });
    }

    static async getUserByCredentials(email, pass) {
        return new Promise((resolve, reject) => {
          db.query(
            "SELECT user_type FROM users_info WHERE email = ? AND pass = ?",
            [email, pass],
            (error, result) => {
              if (!error && result.length > 0) {
                resolve(result[0]);
              } else {
                reject(error);
              }
            }
          );
        });
    }
}
export default UsersModle