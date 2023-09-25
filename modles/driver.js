import db from "../db.js"
class Driver{

    static setIo(io){
        Driver.io = io;
    }

    static async getDriver(){

        return new Promise((resolve , reject)=>{
            db.query("SELECT * FROM driver_account" , [] , (error , result)=>{
                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })
        })
    }

    static async getDriverById(id){

      return new Promise((resolve , reject)=>{
          db.query("SELECT * FROM driver_account WHERE id=?" , [id] , (error , result)=>{
              if(!error){
                  resolve(result)
              }else{
                  reject(error)
              }
          })
      })
  }

    static async getOrdersCompanyAvaliable(driver_id){
        return new Promise((resolve , reject)=>{

          db.query(`SELECT 
          o.client_name, 
          o.client_lat_location, 
          o.client_long_location, 
          o.phone_num, 
          o.buy_cylinder, 
          o.filling_cylinder,
          o.client_address,
          o.company_address,
          o.company_name, 
          o.company_lat_location, 
          o.company_long_location ,
          co.status ,
          co.id ,
          o.company_id
      FROM 
          company_orders AS co
      LEFT JOIN 
          client_orders AS o 
          ON o.order_num = co.order_num
      WHERE 
          co.driver_id = ? 
          AND co.status = 'waiting' 
      ORDER BY 
          co.id ASC
      ` , [driver_id , "waiting"]   , (error , result)=>{

            if(!error){
                console.log(result)

              resolve(result)
            }else{
              reject(error)
              console.log(error)
            }
          })
        })
      }

      static async getAllOrdersCompany(driver_id){
        return new Promise((resolve , reject)=>{

          db.query(`SELECT 
          o.client_name, 
          o.client_lat_location, 
          o.client_long_location, 
          o.phone_num, 
          o.buy_cylinder, 
          o.filling_cylinder,
          o.client_address,
          o.company_address,
          o.company_name, 
          o.company_lat_location, 
          o.company_long_location ,
          co.status ,
          co.id
      FROM 
          company_orders AS co
      LEFT JOIN 
          client_orders AS o 
          ON o.order_num = co.order_num
      WHERE 
          co.driver_id = ? 
      ORDER BY 
          co.id ASC
      ` , [driver_id ]   , (error , result)=>{

            if(!error){

              resolve(result)
            }else{
              reject(error)
            }
          })
        })
      }

      static async getAllDriverNotificationById(driverId){
        return new Promise((resolve , reject)=>{
            db.query(
                `SELECT * FROM app_notifications WHERE reciver_id=?`,
                [driverId],
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

    static async updateOrder_AcceptORCancelOrder(order_status, order_id, response, driverId , company_id) {

        const io = Driver.io;
        let inecrementOrder=0;
        return new Promise((resolve, reject) => {
            if (order_status.toLowerCase() === "accept") {
                db.query(`UPDATE company_orders SET status=? WHERE id=?`, [order_status, order_id], (error, result) => {
                    if (!error) {
                        // The update query was successful
                        // Now, query for the driver's location
                        db.query(`SELECT accepted_driver_order_num FROM driver_account WHERE id=?`, [driverId], (error1, result1) => {
                            if (!error1) {
                                // Successfully retrieved driver's location
                                inecrementOrder = result1[0].accepted_driver_order_num +1;

                                console.log(`resu ${inecrementOrder}`)
                                db.query(`UPDATE driver_account SET accepted_driver_order_num=? WHERE id=?`, [inecrementOrder , driverId], (error2, result2) => {
                               
                                    if(!error2){
                                        resolve(result);
                                    }else{
                                        reject(error2)
                                    }
                                })
                            } else {
                                reject(error1);
                            }
                        });

                                // اشعار المستخدم بقبول الطلب
             io.on("connection" , (socket)=>{
                console.log("User Is connected")
  
                socket.on(`notification${company_id}`, (msg)=>{
                    io.emit(`notification${company_id}`, msg); // Broadcast the message to all connected clients
                });
  
                  // Listen for disconnections
                  socket.on('disconnect', () => {
                    console.log('User disconnected');
                  });
  
             });

                    } else {
                        reject(error);
                    }
                });
            } else if (order_status.toLowerCase() === "cancel") {
                db.query(`UPDATE company_orders SET status=? WHERE id=?`, [order_status, order_id], (error, result) => {
                    if (!error) {
                        // The update query was successful
                        // Now, query for the driver's location
                        db.query(`SELECT accepted_driver_order_num FROM driver_account WHERE id=?`, [driverId], (error1, result1) => {
                            if (!error1) {
                                // Successfully retrieved driver's location
                                inecrementOrder = result1[0].accepted_driver_order_num -1;

                                console.log(`resu ${inecrementOrder}`)
                                db.query(`UPDATE driver_account SET accepted_driver_order_num=? WHERE id=?`, [inecrementOrder , driverId], (error2, result2) => {
                               
                                    if(!error2){
                                        resolve(result);
                                    }else{
                                        reject(error2)
                                    }
                                })
                            } else {
                                reject(error1);
                            }
                        });

                                    // اشعار المستخدم برفض الطلب
             io.on("connection" , (socket)=>{
                console.log("User Is connected")
  
                socket.on(`notification${company_id}`, (msg)=>{
                    io.emit(`notification${company_id}`, msg); // Broadcast the message to all connected clients
                });
  
                  // Listen for disconnections
                  socket.on('disconnect', () => {
                    console.log('User disconnected');
                  });
  
             });
                    } else {
                        reject(error);
                    }
                });
            } else {
                response.status(401).json({
                    status: false,
                    message: "Un Correct status",
                    data: null,
                });
            }
        });
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
    

}export default Driver;