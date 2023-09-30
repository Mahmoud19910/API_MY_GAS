import { resolve } from "path";
import db from "../db.js";
import { error } from "console";
import { query } from "express";
import { rejects } from "assert";

class ClientModel {

    // حفظ الطلب في قاعدة البيانات و حفظ الاشعار
    static async addOrderToDataBase(
        buy_cylinder,
        number_cylinders,
        total_buy_price,
        filling_cylinder,
        packing_quantity,
        total_fill_price,
        order_status,
        order_date,
        company_id , 
        client_id ,
        time_to_arrive	
    ) {
        return new Promise((resolve, reject) => {

            const currentTime = new Date();
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
           // Convert hours from 24-hour format to 12-hour format
           const formattedHours = hours % 12 || 12;
          const timeString = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;   

            let company_name , company_lat_location , company_long_location  , company_address;
            let client_name , client_lat , client_long , client_phone , client_address , client_image;

            // جلب بيانات المستخةم و الشركة لحساب المسافة و الوقت 
            db.query(`SELECT company_name , lat_location , long_location ,
            address
            FROM company_account
             WHERE id=?` , [company_id] , (error , result)=>{

                if(!error && result.length > 0){

                    const company = result[0];

                    company_name = company.company_name;
                    company_lat_location = company.lat_location;
                    company_long_location = company.long_location;
                    company_address = company.address;
                    console.log(company_address);

                    db.query(`SELECT name , client_lat_location , client_long_location ,
                    phone  , client_address , image
                    FROM users_info
                    WHERE id=?` , [client_id] , (error , result)=>{

                if(!error && result.length > 0){

                    const client = result[0];

                    client_name = client.name;
                    client_lat = client.client_lat_location;
                    client_long = client.client_long_location;
                      client_phone = client.phone;
                      client_address = client.client_address;
                      client_image = client.image;

                    console.log(client);

                    // حساب المسافة و الزمن و سعر التوصيل
                       // يتم حساب المسافة عن طريق خطوط الطول و العرض
                let client_long_location_radians = client_long * (Math.PI / 180);
                let company_long_location_radians = company_long_location * (Math.PI / 180);
                let client_lat_location_radians = client_lat * (Math.PI / 180);
                let company_lat_location_radians = company_lat_location * (Math.PI / 180);
            
                // Haversine formula
                let dlon = company_long_location_radians - client_long_location_radians;
                let dlat = company_lat_location_radians - client_lat_location_radians;
                let a = Math.pow(Math.sin(dlat / 2), 2) +
                        Math.cos(client_lat_location_radians) * Math.cos(company_lat_location_radians) *
                        Math.pow(Math.sin(dlon / 2), 2);
            
                let c = 2 * Math.asin(Math.sqrt(a));
            
                // Radius of Earth in kilometers. Use 3956 for miles
                let r = 6371;
                let distance = c * r; // حساب المسافة 
            
                const dilvery_price = distance * 2; // ٢ ريال لكل كيلو متر
                const total_price	= total_buy_price + total_fill_price + dilvery_price ;


                    // حفظ الطلب 

                db.query(
                "INSERT INTO client_order (buy_cylinder, number_cylinders, total_buy_price, filling_cylinder, packing_quantity, total_fill_price, dilvery_price, order_status, order_date , total_price , company_id , client_id , time_to_arrive ) VALUES (?, ?, ?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,?)",
                [
                buy_cylinder ,
                number_cylinders , 
                total_buy_price , 
                filling_cylinder , 
                packing_quantity , 
                total_fill_price , 
                dilvery_price , 
                order_status , 
                order_date , 
                total_price ,
                company_id , 
                client_id , 
                "0"  
                ],
                (error, result) => {
                    if (error) {
                        console.error("Error inserting data:", error);
                        reject(error);
                        console.log(`Error  ${error}`)
                    } else {

            db.query("INSERT INTO app_notifications (sender_image , client_name , reciver_id , sender_id , content , time) VALUES (? , ? , ? , ? , ? , ?)" ,
             [client_image , client_name , company_id , client_id ,  `طلب ${filling_cylinder} \n ${buy_cylinder}` , timeString] , (error , result)=>{

                if(!error){
                    resolve(result)
                }else{
                    reject(error)

                    console.log(`Error  : ${error}`)
                }

            })
                    }
                }
            );



                }else{
                    reject(error)
                }

             });
                    

                }else{
                    reject(error)
                }

             });

         

            // // ارسال رسالة للشركة عند ارسال طللب
            db.query("INSERT INTO chat (sender_id , reciver_id  , message	 , created_at , updated_at , sender_type , reciver_type) VALUES (? , ? , ? , ? ,? , ? , ?)" ,
             [client_id , company_id , `طلب ${filling_cylinder}` , timeString , "" , "client" , "company"] , (error , result)=>{

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
            db.query(`
            SELECT client.name, client.client_lat_location, client.client_long_location,
            client.phone, client.client_address, client.image,
            company.company_name, company.lat_location, company.long_location,
            company.address, client_order.buy_cylinder, client_order.number_cylinders, client_order.total_buy_price,
            client_order.filling_cylinder, client_order.packing_quantity, client_order.total_fill_price, client_order.order_status,
            client_order.dilvery_price, client_order.order_date, client_order.total_price, client_order.time_to_arrive, client_order.order_num
          FROM client_order
          LEFT JOIN users_info AS client ON client.id = client_order.client_id
          LEFT JOIN company_account AS company ON company.id = client_order.company_id
          WHERE client_order.order_num = ?`, [order_num], (error, result) => {
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

            db.query(` SELECT client.name, client.client_lat_location, client.client_long_location,
            client.phone, client.client_address, client.image,
            company.company_name, company.lat_location, company.long_location,
            company.address, client_order.buy_cylinder, client_order.number_cylinders, client_order.total_buy_price,
            client_order.filling_cylinder, client_order.packing_quantity, client_order.total_fill_price, client_order.order_status,
            client_order.dilvery_price, client_order.order_date, client_order.total_price, client_order.time_to_arrive, client_order.order_num
          FROM client_order
          LEFT JOIN users_info AS client ON client.id = client_order.client_id
          LEFT JOIN company_account AS company ON company.id = client_order.company_id
          WHERE client_order.client_id = ?`, [client_id], (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });        })
    }

    static async getAllOrderFromDataBase(){

        return new Promise((resolve , reject)=>{
            db.query(`
            SELECT client.name, client.client_lat_location, client.client_long_location,
            client.phone, client.client_address, client.image,
            company.company_name, company.lat_location, company.long_location,
            company.address, client_order.buy_cylinder, client_order.number_cylinders, client_order.total_buy_price,
            client_order.filling_cylinder, client_order.packing_quantity, client_order.total_fill_price, client_order.order_status,
            client_order.dilvery_price, client_order.order_date, client_order.total_price, client_order.time_to_arrive, client_order.order_num
          FROM client_order
          LEFT JOIN users_info AS client ON client.id = client_order.client_id
          LEFT JOIN company_account AS company ON company.id = client_order.company_id` , [] , (error , result)=>{
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


    static async getAllmessagesById(sender_id , reciver_id , reciver_type , sender_type ) {
        return new Promise((resolve, reject) => {

            if(sender_type === "company" && reciver_type === "client" || sender_type === "client" && reciver_type === "company" ){

                console.log(`Reciver Id  ${reciver_id}`)
                db.query(
                    `
  SELECT chat.id , chat.message , chat.created_at , chat.reciver_type , chat.sender_type , chat.sender_id , chat.reciver_id , sender_info.name , reciver_info.company_name
  FROM chat
  LEFT JOIN users_info AS sender_info ON chat.sender_id = sender_info.id
  LEFT JOIN company_account AS reciver_info ON chat.sender_id = reciver_info.id
  WHERE (chat.sender_id = ? AND chat.reciver_id = ?)
     OR (chat.sender_id = ? AND chat.reciver_id = ?)
     ORDER BY chat.id`,
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
            if(sender_type === "driver" && reciver_type === "company" || sender_type === "company" && reciver_type === "driver" ){
                console.log("2")
                db.query(
                    `
                    SELECT chat.id , chat.message , chat.created_at , sender_info.company_name , reciver_info.driver_name	
                    FROM chat
                    LEFT JOIN company_account AS sender_info ON chat.sender_id = sender_info.id
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

            }else
            if(sender_type === "driver" && reciver_type === "client" || sender_type === "client" && reciver_type === "driver"){
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
                reject("Error Input")
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


    static async getAllClientNotificationById(clientId){
        return new Promise((resolve , reject)=>{
            db.query(
                `SELECT * FROM app_notifications WHERE reciver_id=?`,
                [clientId],
                (error , result)=>{
                    if(!error){
                        resolve(result);
                    }else{
                        reject(error);
                    }
                }
            );
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
