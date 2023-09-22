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
        sender_image , 
        client_address ,
        company_address
    ) {
        return new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO client_orders (client_name, client_lat_location, client_long_location, phone_num, buy_cylinder, number_cylinders, total_buy_price, filling_cylinder, packing_quantity, total_fill_price, dilvery_price, order_status, company_name, order_date, total_price, company_lat_location, company_long_location , company_id , client_id , time_to_arrive	, sender_image , client_address , company_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ? , ? , ? , ? , ?)",
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
                    sender_image ,
                    client_address ,
                    company_address
                ],
                (error, result) => {
                    if (error) {
                        console.error("Error inserting data:", error);
                        reject(error);
                        console.log(`Error  ${error}`)
                    } else {

                        console.log(`Result  ${result}`)
                        console.log("Data inserted successfully:", result);
                        resolve(result);
                    }
                }
            );

            const currentTime = new Date();
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
           // Convert hours from 24-hour format to 12-hour format
           const formattedHours = hours % 12 || 12;
          const timeString = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;   

            db.query("INSERT INTO app_notifications (sender_image , client_name , reciver_id , sender_id , content , time) VALUES (? , ? , ? , ? , ? , ?)" ,
             [sender_image , client_name , company_id , client_id ,  `طلب ${filling_cylinder} \n ${buy_cylinder}` , timeString] , (error , result)=>{

                if(!error){
                    resolve(result)
                }else{
                    reject(error)

                    console.log(`Error  : ${error}`)
                }

            })

            // ارسال رسالة للشركة عند ارسال طللب
            db.query("INSERT INTO chat (sender_id , reciver_id  , message	 , created_at , updated_at , sender_type , reciver_type) VALUES (? , ? , ? , ? ,? , ? , ?)" , [client_id , company_id , `طلب ${filling_cylinder}` , timeString , "" , "client" , "company"] , (error , result)=>{

                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })


// Assuming you have a database connection called 'db'

// Get the current orders_number for the company
db.query("SELECT orders_number FROM company_account WHERE id=?", [company_id], (error, result) => {
    if (error) {
      reject(error); // Reject if there's an error
    } else if (result.length === 0) {
      reject(new Error("Company not found")); // Reject if company not found
    } else {
      const row = result[0];
      const incrementOrder = row.orders_number + 1;
  
      // Update the company's orders_number
      db.query("UPDATE company_account SET orders_number=? WHERE id=?", [incrementOrder, company_id], (updateError, updateResult) => {
        if (!updateError) {
          resolve(updateResult); // Resolve with the update result
        } else {
          reject(updateError); // Reject if there's an error during the update
        }
      });
    }
  });
  
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

    static async sendMessage(message , sender_id , reciver_id , sender_type , reciver_type , created_at){

       

        return new Promise((resolve , reject)=>{
            db.query("INSERT INTO chat (message , sender_id , reciver_id , sender_type , reciver_type , created_at , updated_at) VALUES (? ,? ,? ,? ,? ,? , ?)" , [message , sender_id , reciver_id , sender_type , reciver_type , created_at , "" ], (error , result)=>{

                if(!error){
                    resolve(result)  
                }else{
                    reject(error)
                }
            })
        })
    }


    static async getAllmessagesById(sender_id , reciver_id ,user_type ) {
        return new Promise((resolve, reject) => {

            if(user_type === "company"){

                console.log("1")
                db.query(
                    `
  SELECT chat.id , chat.message , chat.created_at , sender_info.name , reciver_info.company_name
  FROM chat
  LEFT JOIN users_info AS sender_info ON chat.sender_id = sender_info.id
  LEFT JOIN company_account AS reciver_info ON chat.sender_id = reciver_info.id
  WHERE (chat.sender_id = ? AND chat.reciver_id = ?)
     OR (chat.sender_id = ? AND chat.reciver_id = ?)
     ORDER BY chat.id

`,
                    [sender_id , reciver_id , reciver_id , sender_id],
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
            if(user_type === "driver" ){
console.log("2")
                db.query(
                    `
                    SELECT chat.id , chat.message , chat.created_at , sender_info.name , reciver_info.driver_name	
                    FROM chat
                    LEFT JOIN users_info AS sender_info ON chat.sender_id = sender_info.id
                    LEFT JOIN driver_account AS reciver_info ON chat.sender_id = reciver_info.id
                    WHERE (chat.sender_id = ? AND chat.reciver_id = ?)
                       OR (chat.sender_id = ? AND chat.reciver_id = ?)
                       ORDER BY chat.id
                  `,
                    [sender_id, reciver_id  , reciver_id , sender_id],
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

    static async deleteMessageByIdFromDataBase(id){
        return new Promise((resolve , reject)=>{

            db.query("DELETE FROM chat WHERE id=?" , [id] , (error , result)=>{
                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })
        })
    }

    static async evaluationDriverById(evaluation, id) {
        return new Promise((resolve, reject) => {
            db.query("SELECT sum_evaluate_driver, evaluate_num_driver FROM driver_account WHERE id=?", [id], (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
    
                if (result.length === 0) {
                    // No matching driver found
                    resolve({ sum_evaluate_driver: null, evaluate_num_driver: null });
                    return;
                }
    
                // Access the first row in the result array
                const row = result[0];
                const sumEvaluateDriver = row.sum_evaluate_driver + evaluation;
                const evaluateNumDriver = row.evaluate_num_driver +1;

                const averageRatings = sumEvaluateDriver/evaluateNumDriver;
    
                db.query("UPDATE driver_account SET sum_evaluate_driver=?, evaluate_num_driver=? , evaluations =? WHERE id=?", [sumEvaluateDriver, evaluateNumDriver, averageRatings , id], (error, updateResult) => {
                    if (error) {
                        reject(error);
                        return;
                    }
    
                    resolve(updateResult);
                });
            });
        });
    }
    
    
    // static async evaluationDriverById(evaluation , id){

    //     return new Promise((resolve , reject)=>{

    //         db.query("SELECT sum_evaluate_driver , evaluate_num_driver FROM driver_account WHERE id=?",[id],(error , result)=>{
    //             if(!error){

    //                 console.log(result)
    //             }else{
    //                 reject(error)
    //             }
    //         })
        //     db.query("UPDATE driver_account SET evaluations=? WHERE id=?" , [evaluation , id] , (error , result)=>{

        //         if(!error){
        //         resolve(result)
        //         }else{
        //         reject(error)
        //         }
        //     })
        // })

    // }


//     static async getAllmessagesById(sender_id , reciver_id , reciver_type , sender_type  ) {
//         return new Promise((resolve, reject) => {

//             if(reciver_type === "company" || sender_type === "company" && sender_type === "client" || reciver_type === "client"){

//                 console.log("1")
//                 db.query(
//                     "SELECT * FROM chat LEFT JOIN users_info AS sender_info ON chat.sender_id = sender_info.id LEFT JOIN company_account AS reciver_info ON chat.reciver_id = reciver_info.id WHERE (chat.sender_id = ? AND chat.reciver_id = ?) OR (chat.sender_id = ? AND chat.reciver_id = ?) ",
//                     [sender_id , reciver_id  , reciver_id , sender_id ],
//                     (error, result) => {
//                         if (!error) {
//                             resolve(result);
//                         } else {
//                             reject(error);
//                         }
//                     }
//                 );

//             }
//             else
//             if(reciver_type === "driver" || sender_type === "driver" && sender_type === "client" || reciver_type === "client"){
// console.log("2")
//                 db.query(
//                     "SELECT * FROM chat LEFT JOIN users_info AS sender_info ON chat.sender_id = sender_info.id LEFT JOIN driver_account AS reciver_info ON chat.reciver_id = reciver_info.id WHERE (chat.sender_id = ? AND chat.reciver_id = ?) OR (chat.sender_id = ? AND chat.reciver_id = ?) AND (chat.reciver_type = ? OR chat.sender_type = ? )",
//                     [sender_id, reciver_id  , reciver_id , sender_id , 'driver' , 'driver' ],
//                     (error, result) => {
//                         if (!error) {
//                             resolve(result);
//                         } else {
//                             reject(error);
//                         }
//                     }
//                 );

//             }else{
                
//             }
          
//         });
//     }

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
