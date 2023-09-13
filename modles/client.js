import { resolve } from "path";
import db from "../db.js";
import { error } from "console";
import { query } from "express";
import { rejects } from "assert";

class ClientModel {

    // حفظ الطلب في قاعدة البيانات و حفظ الاشعار
    static async addOrderToDataBase(
        client_name,
        client_lat_location,
        client_long_location,
        phone_num,
        buy_cylinder,
        number_cylinders,
        total_buy_price,
        filling_cylinder,
        packing_quantity,
        total_fill_price,
        dilvery_price,
        order_status,
        company_name,
        order_date,
        total_price,
        company_lat_location,
        company_long_location,
        company_id , 
        client_id ,
        time_to_arrive	,
        sender_image
    ) {
        return new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO client_orders (client_name, client_lat_location, client_long_location, phone_num, buy_cylinder, number_cylinders, total_buy_price, filling_cylinder, packing_quantity, total_fill_price, dilvery_price, order_status, company_name, order_date, total_price, company_lat_location, company_long_location , company_id , client_id , time_to_arrive	, sender_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ? , ? , ?)",
                [
                    client_name,
                    client_lat_location,
                    client_long_location,
                    phone_num,
                    buy_cylinder,
                    number_cylinders,
                    total_buy_price,
                    filling_cylinder,
                    packing_quantity,
                    total_fill_price,
                    dilvery_price,
                    order_status,
                    company_name,
                    order_date,
                    total_price,
                    company_lat_location,
                    company_long_location,
                    company_id ,
                    client_id ,
                    time_to_arrive ,
                    sender_image
                ],
                (error, result) => {
                    if (error) {
                        console.error("Error inserting data:", error);
                        reject(error);
                    } else {
                        console.log("Data inserted successfully:", result);
                        resolve(result);
                    }
                }
            );

            // Create a new Date object
          const currentTime = new Date();

           // Get the current hour and minute
           const currentHour = currentTime.getHours();
           const currentMinute = currentTime.getMinutes();    

            db.query("INSERT INTO app_notifications (sender_image , client_name , reciver_id , content , time) VALUES (? , ? , ? , ? , ?)" ,
             [sender_image , client_name , client_id , `طلب ${filling_cylinder} \n ${buy_cylinder}` , `${currentHour}:${currentMinute}`] , (error , result)=>{

                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }

            })

            // ارسال رسالة للشركة عند ارسال طللب
            db.query("INSERT INTO chat (sender_id , reciver_id  , message	 , created_at , updated_at , sender_type , reciver_type) VALUES (? , ? , ? , ? ,? , ? , ?)" , [company_id , client_id , `طلب ${filling_cylinder}` , `${currentHour}:${currentMinute}` , "" , "client" , "company"] , (error , result)=>{

                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })
        });
    }

    static async getOrderByIdFromDataBase(order_num){
        return new Promise((resolve , reject)=>{
            db.query("SELECT * FROM client_orders WHERE order_num=?", [order_num], (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });
        })
    }

    static async getOrderClientbyIdFromDataBase(client_id){
        return new Promise((resolve , reject)=>{

            db.query("SELECT * FROM client_orders WHERE client_id=?", [client_id], (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });        })
    }

    static async getAllOrderFromDataBase(){

        return new Promise((resolve , reject)=>{
            db.query("SELECT * FROM client_orders " , [] , (error , result)=>{
                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
    
            })
        })
     
    }

    static async getAllUsersChat( ){
        return new Promise((resolve , reject)=>{

            db.query("SELECT * FROM chat" , [] , (error , result)=>{

                if(!error){
                resolve(result)
                }else{
                    reject(error)
                }

            })
        })
    }


    static async getAllmessagesById(sender_id , reciver_id , reciver_type , sender_type  ) {
        return new Promise((resolve, reject) => {

            if(reciver_type === "company" || sender_type === "company" && sender_type === "client" || reciver_type === "client"){

                console.log("1")
                db.query(
                    "SELECT * FROM chat LEFT JOIN users_info AS sender_info ON chat.sender_id = sender_info.id LEFT JOIN company_account AS reciver_info ON chat.reciver_id = reciver_info.id WHERE (chat.sender_id = ? AND chat.reciver_id = ?) OR (chat.sender_id = ? AND chat.reciver_id = ?) ",
                    [sender_id , reciver_id  , reciver_id , sender_id ],
                    (error, result) => {
                        if (!error) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

            }
            else
            if(reciver_type === "driver" || sender_type === "driver" && sender_type === "client" || reciver_type === "client"){
console.log("2")
                db.query(
                    "SELECT * FROM chat LEFT JOIN users_info AS sender_info ON chat.sender_id = sender_info.id LEFT JOIN driver_account AS reciver_info ON chat.reciver_id = reciver_info.id WHERE (chat.sender_id = ? AND chat.reciver_id = ?) OR (chat.sender_id = ? AND chat.reciver_id = ?) AND (chat.reciver_type = ? OR chat.sender_type = ? )",
                    [sender_id, reciver_id  , reciver_id , sender_id , 'driver' , 'driver' ],
                    (error, result) => {
                        if (!error) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

            }else{
                
            }
          
        });
    }

    // static async getAllmessagesById(sender_id, reciver_id , reciver_type) {
    //     return new Promise((resolve, reject) => {

    //         if(reciver_type === "company"){

    //         }
    //         else
    //         if(reciver_type === "driver"){

    //         }else{

    //         }
    //         db.query(
    //             "SELECT * FROM chat WHERE (chat.sender_id = ? AND chat.reciver_id = ?) OR (chat.sender_id = ? AND chat.reciver_id = ?)",
    //             [sender_id, reciver_id , reciver_id , sender_id ],
    //             (error, result) => {
    //                 if (!error) {
    //                     resolve(result);
    //                 } else {
    //                     reject(error);
    //                 }
    //             }
    //         );
    //     });
    // }
    
}

export default ClientModel;
