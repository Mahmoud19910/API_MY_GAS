import companyModle from "../modles/company.js";
import usersModle from "../modles/users.js";
import clientModle from "../modles/client.js"



class CompanyController{

   static setIo(io){
        CompanyController.io=io;
    }

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

    static async getOrderClientAvaliable(request, response) {
        // try {
            const companyId = request.query.company_id;// Use request.query to access query parameters
    
            console.log(`company Id ${companyId}`);
            response.status(200).json({"fas":r3r})
    
        //     const result = await companyModle.getOrdersClientAvaliable(companyId); // Await the asynchronous operation
    
        //     console.log(result)
        //     if (result) {
        //         response.status(200).json({
        //             status: true,
        //             message: "Success",
        //             data: "result",
        //         });
        //     } else {
        //         response.status(402).json({
        //             status: false,
        //             message: "Un Success",
        //             data: "null",
        //         });
        //     }
        // } catch (error) {
        //     console.log(`Error   ${error}`)
        //     response.status(500).json({
        //         status: false,
        //         message: error,
        //         data: null,
        //     });
        // }
    }


    static async getAllOrderClient(request, response) {
        try {
            const companyId = request.query.company_id; // Use request.query to access query parameters
    
            console.log(`company Id ${companyId}`);
    
            const result = await companyModle.getAllOrdersClient(companyId); // Await the asynchronous operation
    
            if (result) {
                response.status(200).json({
                    status: true,
                    message: "Success",
                    data: result,
                });
            } else {
                response.status(402).json({
                    status: false,
                    message: "Un Success",
                    data: null,
                });
            }
        } catch (error) {
            console.log(`Error   ${error}`)
            response.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }
    }


    static async getOrderClientDetail(request , response){

       const order_num =  request.query.order_num;


       try{

        const result = await companyModle.getOrderDetails(order_num);

        if(result){
         response.status(200).json({
             status: true,
             message: "Success",
             data: result,
         });
        }else{
         response.status(401).json({
             status: false,
             message: "Un Sucess",
             data: null,
         });
        }
       }catch(error){
   response.status(500).json({
             status: false,
             message: error,
             data: null,
         });
       }
       


    }

    static async acceptOrCancelOrder(request , response){

       const io = CompanyController.io;
        const {order_num , order_status , company_id , client_id } = request.body;
       
            const result = await companyModle.updateOrder_AcceptORCancelOrder(order_num , order_status , company_id , response);

            if(result){
                response.status(200).json({
                    status: true,
                    message: "Success update",
                    data: null,
                });

            //  // اشعار المستخدم بقبول الطلب او رفضه
            //  io.on("connection" , (socket)=>{
            //     console.log("User Is connected")

            //     socket.on(`notification`, (msg)=>{
            //         io.emit(`notification`, msg); // Broadcast the message to all connected clients
            //     });

            //       // Listen for disconnections
            //       socket.on('disconnect', () => {
            //         console.log('User disconnected');
            //       });

            //  });

            }else{
                response.status(401).json({
                    status: false,
                    message: "Un Success",
                    data: null,
                });
            }
       

    }

    static async addDriverToCompanyList(request , response){
       const {company_id , driver_id} =  request.body;

       try{
        const result = await companyModle.addDriverToList(company_id , driver_id);

        if(result){
         response.status(200).json({
             status: true,
             message: "Success",
             data: null,
         });
        }else{
         response.status(401).json({
             status: false,
             message: "Un Success",
             data: null,
         });
        }
       }catch(error){
        response.status(500).json({
            status: false,
            message: error,
            data: null,
        });
       }
      

    }

    static async getCompanyDrivers(request , response){
        const companyId = request.query.company_id;

        try{
            const result  = await companyModle.getMyDriver(companyId);
            if(result){
                response.status(200).json({
                    status: true,
                    message: "Success",
                    data: result,
                });
            }else{
                response.status(401).json({
                    status: false,
                    message: "Un Success",
                    data: null,
                });
            }
        }catch(error){
            response.status(500).json({
                status: false,
                message: error ,
                data: null,
            });
        }
      
    }

    static async deleteDriverById(request , response){
        try{
            const driverId = request.query.id;

           const result = await companyModle.deleteDriverById(driverId);

           if(result){
            response.status(200).json({
                status: true,
                message: "Success Delete",
                data: result,
            });
           }else{
            response.status(401).json({
                status: false,
                message: "Un Success Delete",
                data: null,
            });
           }

        }catch(error){
            response.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }
    }

    static async searchForDriver(request , response){

        try{
            const company_id =  request.query.company_id;
            const driverName =  request.query.driverName;

          const result = await companyModle.searchDriver(driverName , company_id);

          if(result){
            response.status(200).json({
                status: true,
                message: "Success",
                data: result,
            });
          }else{
            response.status(200).json({
                status: false,
                message: "Un Success",
                data: null,
            });
          }
        }catch(error){
            response.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }
      


    }
    

    // تستخدم عند النقر على سائق في الخريطة لعرض المسافة و الوقت
    static async showDriverDetailsOnclickTheLocation(request , response){

        const {driver_lat_location , driver_long_location , company_lat_location , company_long_location , driver_name} = await request.body;

        console.log(request.body)
        try{

            if(
                !driver_lat_location ||
                !driver_long_location ||
                !company_lat_location ||
                !company_long_location ||
                !driver_name ){
    
                       // Respond with an error status code and message
                       response.status(401).json({
                        status: false,
                        message: "Unsuccess There is contain a null value",
                        data: null
                      });
                }
                else{
    
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
    
              const result ={
                "driver_name" : driver_name ,
                "status" : "قيد التسليم" ,
                "distance" : distance ,
                "time" : distance*4
              }
    
              if(result){
                response.status(200).json({
                    status: true,
                    message: "Success",
                    data: result,
                });
              }else{
                response.status(401).json({
                    status: false ,
                    message: "Un Success",
                    data: null,
                });
              }
    
                }
    
        }catch(error){
            response.status(500).json({
                status: false ,
                message: error,
                data: null,
            });
        }
     
         

    }


    static async newOrderToDriver(request , response){

        try{
            const {order_num, driver_id , company_id} = request.body;
            const result = await companyModle.sendNewOrderToDriver(order_num , driver_id , company_id);

            if(result){
                response.status(200).json({
                    status: true,
                    message: "Success",
                    data: null,
                });
            }else{
                response.status(401).json({
                    status: false,
                    message: "Un Success",
                    data: null,
                });
            }
        }catch(error){
            response.status(500).json({
                status: false,
                message:error,
                data: null,
            });
        }
        
    }

    static async getAllUsersINChatCompany(request, response) {
        const company_id = Number(request.query.company_id);
        const uniqueUsers = new Set();
        const finalUserList = [];
        try {
            const result = await clientModle.getAllUsersChat();
    
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    if (
                        (result[i].sender_id === company_id || result[i].reciver_id === company_id) &&
                        (result[i].sender_type === "company" || result[i].reciver_type === "company")
                    ) {
                        const userId = result[i].sender_id === company_id ? result[i].reciver_id : result[i].sender_id;
                        const userType = result[i].sender_id === company_id ? result[i].reciver_type : result[i].sender_type;
    
                        // Create a unique user key based on user ID and user type
                        const userKey = `${userId}-${userType}`;
    
                        // Add the user to the Set if it's unique
                        uniqueUsers.add(userKey);
                    }
                }
    
                // Iterate through unique user keys and retrieve user information
                for (const userKey of uniqueUsers) {
                    const [userId, userType] = userKey.split('-');
                    const user = await usersModle.getUserById(userId, userType);
                    finalUserList.push(user);
                }

            
    
                response.status(200).json({
                    status: true,
                    message: "Success",
                    data: finalUserList,
                });
            } else {
                response.status(401).json({
                    status: false,
                    message: "Unsuccessful",
                    data: null,
                });
            }
        } catch (error) {
            response.status(500).json({
                status: false,
                message: "Internal Server Error",
                data: error,
            });
        }
    }


    static async sendMessage(request , response){

        const io = CompanyController.io;

        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
       // Convert hours from 24-hour format to 12-hour format
       const formattedHours = hours % 12 || 12;
      const timeString = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

        try{
            const {message , sender_id , reciver_id , sender_type , reciver_type} = request.body;
           const result = await clientModle.sendMessage(message , sender_id , reciver_id , sender_type , reciver_type , timeString);
           const senderUser = await usersModle.getUserById(sender_id , "company");

           console.log(result)
           if(result && senderUser){
            response.status(200).json({
                status: true,
                message: "Success Send",
                data: null,
            });


            // WebSocket event handling
    io.on('connection', (socket) => {
    console.log('User connected');
  
    console.log("Reciver Why Null")
    console.log(reciver_id);
    // Listen for chat messages
    socket.on(`chat${reciver_id}` , (msg) => {
      io.emit(`chat${reciver_id}`, msg); // Broadcast the message to all connected clients
    });
  
    // Listen for disconnections
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  io.on('connection', (socket) => {
    console.log('User connected');
  
    console.log("Reciver Why Null")
    console.log(reciver_id);
    // Listen for chat messages
    socket.on(`${sender_id}chat${reciver_id}` , (msg) => {
      io.emit(`${sender_id}chat${reciver_id}`, msg); // Broadcast the message to all connected clients
    });
  
    // Listen for disconnections
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
           
              
           }else{
            response.status(401).json({
                status: false,
                message: "Un Success Send The Message ",
                data: null,
            });
           }

        }catch(error){
            response.status(500).json({
                status: false,
                message: error,
                data: null,
            });
        }

    }


    static async getMessagesById(request , response){

        try{

            const {sender_id , reciver_id , reciver_type , sender_type } = request.body
            const result = await clientModle.getAllmessagesById(Number(sender_id) , Number(reciver_id) ,  reciver_type , sender_type) ;

            if(result){
                response.status(200).json({
                    "status": true,
                    "message": "Success",
                    "data": result
                })
            }else{
                response.status(401).json({
                    "status": false,
                    "message": "Un Success",
                    "data": null
                })
            }
        }catch(error){

            response.status(500).json({
                "status": true,
                "message": error,
                "data": null
            })

        }

    }

    static async deleteMessageById(request , response){
        const id = Number(request.query.id);

        try{
            const result = await clientModle.deleteMessageByIdFromDataBase(id);

            if(result){
                response.status(200).json({
                    status: true,
                    message: "Success Delete ",
                    data: null,
                });
            }else{
                response.status(401).json({
                    status: false,
                    message: "Un Success Delete ",
                    data: null,
                });  
            }
        }catch(error){
            response.status(500).json({
                status: false,
                message: error,
                data: null,
            });  
        }
     
    }

    static async getAllCompanyNotification(request , response){

        const companyId =  Number(request.query.companyId);
 
        console.log(companyId)
        try{
 
       const result = await companyModle.getAllCompanyNotificationById(companyId);
 
       console.log(`result`)
       if(result && result.length>0){
         response.status(200).json({
             status: true,
             message: "Success ",
             data: result,
         });
       }else{
         response.status(401).json({
             status: false,
             message: "Un Success ",
             data: null,
         });
       }
 
        }catch(error){
         response.status(500).json({
             status: false,
             message: error,
             data: null,
         });
        }
 
     }
     

}
export default CompanyController;