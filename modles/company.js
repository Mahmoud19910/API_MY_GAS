import express, { query } from "express";
import db from "../db.js";
class Company{

  static setIo(io){
    Company.io=io;
}

    static async addNewService(serviceName , quantity , price_Per_Unit){
        return new Promise((resolve ,reject)=>{

            db.query("INSERT INTO company_service (serviceName, quantity, price_Per_Unit) VALUES (?, ?, ?)" , [serviceName , quantity , price_Per_Unit] , (error , result)=>{

                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })

        })

    }

    static async updatePriceAndQuantityService(quantity, price_Per_Unit, id) {
        return new Promise((resolve, reject) => {
          db.query(
            "UPDATE company_service SET quantity = ?, price_Per_Unit = ? ",
            [quantity, price_Per_Unit, id],
            (error, result) => {
              if (!error) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
        });
      }

      static async getOrdersClientAvaliable(company_id){
        return new Promise((resolve , reject)=>{

          db.query("SELECT company_id , client_id , filling_cylinder  , buy_cylinder , order_num , sender_image  FROM client_orders WHERE company_id=? AND order_status=? ORDER BY order_num ASC" , [company_id , "waiting"]   , (error , result)=>{

            if(!error){

              console.log(result)
              resolve(result)
            }else{
              console.log(error)

              reject(error)
            }
          })
        })
      }


      static async getAllOrdersClient(company_id){
        return new Promise((resolve , reject)=>{

          db.query(`
          SELECT client.id , client.image,
          company.id , client_order.buy_cylinder, client_order.filling_cylinder, 
          client_order.order_num
        FROM client_order
        LEFT JOIN users_info AS client ON client.id = client_order.client_id
        LEFT JOIN company_account AS company ON company.id = client_order.company_id
        WHERE client_order.company_id=? ORDER BY order_num ASC
        ` , [company_id ]   , (error , result)=>{

            if(!error){

              resolve(result)
            }else{
              reject(error)
            }
          })
        })
      }

      // static async getAllOrdersClient(company_id){
      //   return new Promise((resolve , reject)=>{

      //     db.query("SELECT company_id , client_id , filling_cylinder  , buy_cylinder , order_num , sender_image  FROM client_orders WHERE company_id=? ORDER BY order_num ASC" , [company_id ]   , (error , result)=>{

      //       if(!error){

      //         resolve(result)
      //       }else{
      //         reject(error)
      //       }
      //     })
      //   })
      // }


      static async getOrderDetails(order_num ){

        return new Promise((resolve , reject)=>{

          db.query(`
          SELECT client.name, client.id,
          client.client_address, 
         client_order.buy_cylinder, client_order.total_buy_price,
          client_order.filling_cylinder,  client_order.total_fill_price, 
         client_order.total_price
        FROM client_order
        LEFT JOIN users_info AS client ON client.id = client_order.client_id
        LEFT JOIN company_account AS company ON company.id = client_order.company_id
        WHERE client_order.order_num=?` , [order_num] , (error , result)=>{

            if(!error){
              resolve(result)
            }else{
              reject(error)
            }
          })
        })
      }

      // static async getOrderDetails(order_num ){

      //   return new Promise((resolve , reject)=>{

      //     db.query("SELECT client_id , client_name , buy_cylinder , filling_cylinder , total_buy_price , total_fill_price , total_price , client_address  FROM client_orders WHERE order_num=?" , [order_num] , (error , result)=>{

      //       if(!error){
      //         resolve(result)
      //       }else{
      //         reject(error)
      //       }
      //     })
      //   })
      // }

  
    
      
      // static async updateOrder_AcceptORCancelOrder(order_num , order_status , company_id , res){

      //   let latClient=0;
      //   let longClient=0;
      //   let clientName , clientImage , clientId , buy_cylinder , filling_cylinder;
      //   let minDistance=0;
      //   let latCompany ,longCompany , companyId , companyName , rejected_order_num	 ;

      //   return new Promise((resolve ,  reject)=>{
          
      //     db.query("SELECT * FROM client_orders WHERE order_num=?", [order_num], (error1, result1) => {
      //       console.log("Result1:", result1);

      //       if (!error1 && result1.length > 0) {
      //         latClient = result1[0].client_lat_location;
      //         longClient = result1[0].client_long_location;
      //         clientName = result1[0].client_name;
      //         clientImage = result1[0].sender_image;
      //         clientId = result1[0].client_id;
      //         filling_cylinder = result1[0].filling_cylinder;
      //         buy_cylinder = result1[0].buy_cylinder;

      //         resolve(result1)
      //       } else {
      //         console.error("Database query error:", error1);
      //         reject(error1); // Reject if there's an error during the client location query
      //       }
      //     });
      //       });
      //     }
          
      static async updateOrder_AcceptORCancelOrder(order_num , order_status , company_id , res){
        const io = Company.io;

        let latClient=0;
        let longClient=0;
        let clientName , clientImage , clientId , buy_cylinder , filling_cylinder;
        let minDistance=0;
        let latCompany ,longCompany , companyId , companyName , rejected_order_num	 ;
        let lessDistanceCompanyId;

        return new Promise((resolve ,  reject)=>{
          
          if(order_status.toLowerCase() === "accept"){
            console.log("ACCEPT")
            db.query("SELECT accepted_order_num FROM company_account WHERE id=?", [company_id], (error, result) => {
              if (error) {
                console.log(`ERROR1  ${error}`)
                reject(error); // Reject if there's an error
              } else if (result.length === 0) {
                console.log(`ERROR2`)
                reject(new Error("Company not found")); // Reject if company not found
              } else {
                const row = result[0];
                const incrementAcceptedOrder = row.accepted_order_num + 1;

                 // سوف يتم حساب الطلبات المقبولة من طرف السائق عند قبول الطلب
                // Update the company's orders_number
                db.query("UPDATE company_account SET accepted_order_num=? WHERE id=?", [incrementAcceptedOrder, company_id], (updateError, updateResult) => {
                  if (!updateError) {
                    resolve(updateResult); // Resolve with the update result
                  } else {
                    console.log(`ERROR3   ${updateError}`)

                    reject(updateError); // Reject if there's an error during the update
                  }
                });
              }
            }); 

                // تعديل حالة الطلب الى مقبول
                // Update the client's order to the nearest company
                db.query(
                  "UPDATE client_order SET order_status=? WHERE order_num=?",
                  [order_status , order_num],
                  (error, result) => {
                    if (!error) {

                       // اشعار المستخدم بقبول الطلب
             io.on("connection" , (socket)=>{
              console.log("User Is connected")

              socket.on(`notification${clientId}`, (msg)=>{
                  io.emit(`notification${clientId}`, msg); // Broadcast the message to all connected clients
              });

                // Listen for disconnections
                socket.on('disconnect', () => {
                  console.log('User disconnected');
                });

           });
                      resolve(result);
                    } else {
                      console.error("Error updating order to the nearest company:", error);
                      reject(error);
                    }

                    // if(error){
                    //   res.status(500).json({ error: "Internal server error" });
                    // }else{
                    //   res.status(200).json({ message: "Order updated successfully" });
                    // }
                  }
                );

            
               }

               else

               if (order_status.toLowerCase() === "cancel") {
                // Query to get the client's location
                db.query(`SELECT client.name, client.client_lat_location, client.client_long_location, client.id ,
                client.phone, client.client_address, client.image,
                company.company_name, company.lat_location, company.long_location,
                company.address, client_order.buy_cylinder, client_order.number_cylinders, client_order.total_buy_price,
                client_order.filling_cylinder, client_order.packing_quantity, client_order.total_fill_price, client_order.order_status,
                client_order.dilvery_price, client_order.order_date, client_order.total_price, client_order.time_to_arrive, client_order.order_num
              FROM client_order
              LEFT JOIN users_info AS client ON client.id = client_order.client_id
              LEFT JOIN company_account AS company ON company.id = client_order.company_id
              WHERE client_order.order_num = ?`, [order_num], (error1, result1) => {
                  console.log("Result1:", result1);

                  if (!error1 && result1.length > 0) {
                    latClient = result1[0].client_lat_location;
                    longClient = result1[0].client_long_location;
                    clientName = result1[0].name;
                    clientImage = result1[0].image;
                    clientId = result1[0].id;
                    filling_cylinder = result1[0].filling_cylinder;
                    buy_cylinder = result1[0].buy_cylinder;



          
                    // Query to get company locations
                    db.query("SELECT id, company_name, rejected_order_num	 , lat_location, long_location FROM company_account",
                     [], (error, result) => {
                      if (!error) {
                        if (Array.isArray(result) && result.length > 0) {
                          for (let i = 0; i < result.length; i++) {
                            const row = result[i];
                            latCompany = row.lat_location;
                            longCompany = row.long_location;
                            companyId = row.id;
                            companyName = row.company_name;
          
                            // Calculate the distance using Haversine formula
                            let client_long_location_radians = longClient * (Math.PI / 180);
                            let company_long_location_radians = longCompany * (Math.PI / 180);
                            let client_lat_location_radians = latClient * (Math.PI / 180);
                            let company_lat_location_radians = latCompany * (Math.PI / 180);
          
                            let dlon = company_long_location_radians - client_long_location_radians;
                            let dlat = company_lat_location_radians - client_lat_location_radians;
                            let a = Math.pow(Math.sin(dlat / 2), 2) +
                              Math.cos(client_lat_location_radians) * Math.cos(company_lat_location_radians) *
                              Math.pow(Math.sin(dlon / 2), 2);
          
                            let c = 2 * Math.asin(Math.sqrt(a));
          
                            // Radius of Earth in kilometers. Use 3956 for miles
                            let r = 6371;
                            let distance = c * r; // Calculate the distance in kilometers
          
                            // Update minDistance as needed
                            if (i === 0 || minDistance > distance && row.id !== company_id) {
                              minDistance = distance;
                              latCompany = row.lat_location;
                              longCompany = row.long_location;
                              lessDistanceCompanyId = row.id;
                              companyName = row.company_name;
                              rejected_order_num	 = row.rejected_order_num	+ 1;
                              console.log(`Client Latitude: ${latClient}`);
                              console.log(`Client Longitude: ${longClient}`);
                              console.log(`The distance to ${companyId} is ${distance} km`);

                            }
          
                          
                          }
                          console.log(`The distance final ${lessDistanceCompanyId} is  km`);

                          // تعديل الطلب الى عنوان الشركة الجديد و ارسال اشعار الشركة بالطلب الجديد و اشعار الى العميل برفض الطلب و تحويله
                          db.query(
                            "UPDATE client_order SET order_status=?, company_id=? WHERE order_num=?",
                            ["waiting", lessDistanceCompanyId, order_num ],
                            (error, result) => {
                              if (!error) {
                                const currentTime = new Date();
                                const hours = currentTime.getHours();
                                const minutes = currentTime.getMinutes();
                                const ampm = hours >= 12 ? 'PM' : 'AM';
                               // Convert hours from 24-hour format to 12-hour format
                               const formattedHours = hours % 12 || 12;
                              const timeString = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;   
      
      
                                // اشعار رفض الطلب للعميل
                              db.query("INSERT INTO app_notifications (	sender_image , client_name , reciver_id , content , time , sender_id) VALUES (? ,? ,? ,? ,? ,?)",
                              [clientImage , clientName , clientId ,  `تم رفض طلب ${filling_cylinder} \n ${buy_cylinder} و تحويل الطلب الى ${companyName}` , timeString , clientId  ]
                              ,(error , result)=>{
                                if(!error){

                                       
                       // اشعار المستخدم برفض الطلب
             io.on("connection" , (socket)=>{
              console.log("User Is connected")

              socket.on(`notification${clientId}`, (msg)=>{
                  io.emit(`notification${clientId}`, msg); // Broadcast the message to all connected clients
              });

                // Listen for disconnections
                socket.on('disconnect', () => {
                  console.log('User disconnected');
                });

           });
                                  resolve(result)
                                }else{
                                  reject(error)
                                  console.log("Error")
                                }
                              });


                                //  اشعار طلب للشركة الجديدة
                                db.query("INSERT INTO app_notifications (	sender_image , client_name , reciver_id , content , time , sender_id) VALUES (? ,? ,? ,? ,? ,?)",
                                 [clientImage , clientName , lessDistanceCompanyId ,  ` طلب ${filling_cylinder} \n ${buy_cylinder}` , timeString , clientId  ]
                                 ,(error , result)=>{
         
                                   if(!error){

                                                     // اشعار المستخدم برفض الطلب
             io.on("connection" , (socket)=>{
              console.log("User Is connected")

              socket.on(`notification${companyId}`, (msg)=>{
                  io.emit(`notification${companyId}`, msg); // Broadcast the message to all connected clients
              });

                // Listen for disconnections
                socket.on('disconnect', () => {
                  console.log('User disconnected');
                });

           });

                                     resolve(result)
                                   }else{
                                     reject(error)
                                     console.log("Error")
                                   }
                                 });

                                console.log("Order updated to the nearest company.");

                                resolve(result);
                              } else {
                                console.error("Error updating order to the nearest company:", error);
                                reject(error);
                              }
                            }
                          );

                           //  حساب الطلبات المرفوضة عند رفض الطلب
                          db.query("UPDATE company_account SET rejected_order_num=? WHERE id=?" , [rejected_order_num , companyId],(error , result)=>{
                            if(!error){
                              console.log(`RESULT  : ${result}`)
                              resolve(result)
                            }else{
                              reject(error)
                              console.log(`ERRORS  : ${error}`)
                            }
                          })

                          const currentTime = new Date();
                          const hours = currentTime.getHours();
                          const minutes = currentTime.getMinutes();
                          const ampm = hours >= 12 ? 'PM' : 'AM';
                         // Convert hours from 24-hour format to 12-hour format
                         const formattedHours = hours % 12 || 12;
                        const timeString = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;   


                        //   // حفظ اشعار جديد 
                        // db.query("INSERT INTO app_notifications (	sender_image , client_name , reciver_id , content , time , sender_id) VALUES (? ,? ,? ,? ,? ,?)",
                        // [clientImage , clientName , companyId ,  `تم رفض طلب ${filling_cylinder} \n ${buy_cylinder} و تحويل الطلب الى ${companyName}` , timeString , clientId  ]
                        // ,(error , result)=>{

                        //   if(!error){

                        //     // io.on('connection', (socket) => {
                        //     //   console.log('User connected');
                            
                        //     //   // Listen for chat messages
                        //     //   socket.on(`notification${company_id}` , (msg) => {
                        //     //     io.emit(`notification${company_id}`, msg); // Broadcast the message to all connected clients
                        //     //   });
                            
                        //     //   // Listen for disconnections
                        //     //   socket.on('disconnect', () => {
                        //     //     console.log('User disconnected');
                        //     //   });
                        //     // });


                        //     resolve(result)
                        //   }else{
                        //     reject(error)
                        //     console.log("Error")
                        //   }
                        // });

                        resolve(result)

                        } else {
                          console.log("No results found.");
                          // Handle no company results if needed
                          reject("No companies found.");
                        }
                      } else {
                        console.error("Database query error:", error);
                        reject(error); // Reject if there's an error during the company location query
                      }
                    });

                    resolve(result1)
                  } else {
                    console.error("Database query error:", error1);
                    reject(error1); // Reject if there's an error during the client location query
                  }
                });

              } 
              
              else 
              {
                reject("error input");
              }
            });
          }

      static async addDriverToList(company_id , driver_id){
        return new Promise((resolve , reject)=>{
          db.query("INSERT INTO company_drivers (company_id , driver_id)VALUES ( ? , ? )" , [company_id , driver_id] , (error , result)=>{

            if(!error){
              resolve(result)
            }else{
              reject(error)
            }
          })
        })
      }

      static async getMyDriver(company_id ){  
        return new Promise((resolve , reject)=>{

          db.query(`SELECT company.lat_location , company.long_location , driver.id , driver.driver_name	, driver.evaluations , driver.orders_number ,  driver.email , driver.driver_lat_location , driver.driver_long_location , driver.image , company_drivers.id
          FROM company_drivers
          LEFT JOIN driver_account AS driver ON driver.id = company_drivers.driver_id
          LEFT JOIN company_account AS company ON company.id = company_drivers.company_id
          WHERE company_drivers.company_id = ?`
          , [company_id] , (error , result)=>{

            if(!error){

              for(let i=0 ; i<result.length ; i++){

              const driver_lat_location =  result[0].driver_lat_location;
              const driver_long_location =  result[0].driver_long_location;
              const company_lat_location =  result[0].lat_location;
              const company_long_location =  result[0].long_location;

                         // Calculate the distance using Haversine formula
                         let driver_long = driver_long_location * (Math.PI / 180);
                         let company_long_location_radians = company_long_location * (Math.PI / 180);
                         let driver_lat = driver_lat_location * (Math.PI / 180);
                         let company_lat_location_radians = company_lat_location * (Math.PI / 180);
               
                         let dlon = company_long_location_radians - driver_long;
                         let dlat = company_lat_location_radians - driver_lat;
                         let a = Math.pow(Math.sin(dlat / 2), 2) +
                           Math.cos(driver_lat) * Math.cos(company_lat_location_radians) *
                           Math.pow(Math.sin(dlon / 2), 2);
               
                         let c = 2 * Math.asin(Math.sqrt(a));
               
                         // Radius of Earth in kilometers. Use 3956 for miles
                         let r = 6371;
                         let distance = c * r; // Calculate the distance in kilometers

                         // اضافة المسافة الى الاوبجكت
                         result[0].distance = distance;


              }
              resolve(result)
            }else{
              reject(error)
            }
          })
        })
      }

      static async deleteDriverById(driverId) {
        return new Promise((resolve, reject) => {
          db.query("DELETE FROM company_drivers WHERE driver_id=?", [driverId], (error, result) => {
            if (!error) {
              resolve(result);
            } else {
              reject(error);
            }
          });
        });
      }

      static async searchDriver(driverName , company_id){
        return new Promise((resolve , reject)=>{

          db.query(`SELECT driver.id , driver.driver_name	, driver.email , driver.lat_location , driver.long_location , driver.image , company_drivers.id
          FROM company_drivers
          LEFT JOIN driver_account AS driver ON driver.id = company_drivers.driver_id
          WHERE 
          company_drivers.company_id = ?
          AND 
          driver.driver_name LIKE ?`
          , [company_id , `%${driverName}%`] , (error , result)=>{

            if(!error){
              resolve(result)
            }else{
              reject(error)
            }
          })
        })
      }

      // static async getDriverDetails(driver_lat_location , driver_long_location , company_lat_location , company_long_location , driver_name){
      //   return new Promise((resolve , reject)=>{

      //     db.query("SELECT driver.driver_name , driver.lat_location , driver.long_location , ")
      //   })
      // }
      static async sendNewOrderToDriver(company_order_num , driver_id , company_id){
        return new Promise((resolve , reject)=>{

          db.query("INSERT INTO company_orders (order_num , driver_id , company_id , status )  VALUES (? , ? , ? , ?)" , [company_order_num , driver_id , company_id , "waiting"] , (error , result)=>{

            if(!error){
              resolve(result)
            }else{
              reject(error)
            }
          });


          db.query(`SELECT company.company_name, company.image , clientOrder.filling_cylinder, clientOrder.buy_cylinder
          FROM company_orders
          LEFT JOIN company_account AS company ON company_orders.company_id = company.id
          LEFT JOIN client_orders AS clientOrder ON company_orders.order_num = clientOrder.order_num
          WHERE clientOrder.order_num = ? AND clientOrder.company_id = ?
          `,[company_order_num , company_id  ] , (error , result1)=>{

           if(!error){

            const row = result1[0];

            const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
       // Convert hours from 24-hour format to 12-hour format
       const formattedHours = hours % 12 || 12;
      const timeString = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

            db.query("INSERT INTO app_notifications (sender_image , client_name , reciver_id , content , time , sender_id )  VALUES (? , ? , ? , ? , ? , ?)" ,
             [row.image , row.company_name , driver_id , `${row.filling_cylinder}  \n ${row.buy_cylinder}` , timeString , company_id ] , (error , result)=>{

              if(!error){
                resolve(result)
              }else{
                reject(error)
              }
            });

              // ارسال رسالة للسائق عند ارسال طللب
              db.query("INSERT INTO chat (sender_id , reciver_id  , message	 , created_at , updated_at , sender_type , reciver_type) VALUES (? , ? , ? , ? ,? , ? , ?)" , [company_id , driver_id , `طلب ${row.filling_cylinder}  \n ${row.buy_cylinder} \n من شركة ${row.company_name}` , timeString , "" , "company" , "driver"] , (error , result)=>{

                if(!error){
                    resolve(result)
                }else{
                    reject(error)
                }
            })

           }else{
             reject(error)
           }
          })


          // Assuming you have a database connection called 'db'

// Get the current orders_number for the company
db.query("SELECT driver_orders_number FROM driver_account WHERE id=?", [driver_id], (error, result) => {
  if (error) {
    reject(error); // Reject if there's an error
  } else if (result.length === 0) {
    reject(new Error("Company not found")); // Reject if company not found
  } else {
    const row = result[0];
    const incrementOrder = row.driver_orders_number + 1;

    // Update the company's orders_number
    db.query("UPDATE driver_account SET driver_orders_number=? WHERE id=?", [incrementOrder, driver_id], (updateError, updateResult) => {
      if (!updateError) {
        resolve(updateResult); // Resolve with the update result
      } else {
        reject(updateError); // Reject if there's an error during the update
      }
    });
  }
});

        })
      }

      static async getAllCompanyNotificationById(companyId){
        return new Promise((resolve , reject)=>{
            db.query(
                `SELECT * FROM app_notifications WHERE reciver_id=?`,
                [companyId],
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
      
      
}
export default Company;