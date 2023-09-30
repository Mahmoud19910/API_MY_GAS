import driver from "../modles/driver.js"
import usersModle from "../modles/users.js";
import clientModle from "../modles/client.js"



class DriverController{

    static setIo(io){
        DriverController.io=io;
    }

    static async getAllDriver(request , response){

        try{
            const result = await driver.getDriver();

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
                message: error,
                data: null,
            });

        }
       
    }

    static async getDriverById(request , response){

        const driverId = request.query.driverId;

        try{
            const result = await driver.getDriverById(driverId);

            if(result && result.length>0){
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
                message: error,
                data: null,
            });

        }
       
    }


    static async getOrderCompanyAvaliable(request, response) {
        try {
            const driver_id = request.query.driver_id; // Use request.query to access query parameters
    
            console.log(`company Id ${driver_id}`);
    
            const result = await driver.getOrdersCompanyAvaliable(driver_id); // Await the asynchronous operation
    
            console.log(result)
            if (result && result.length>0) {
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

    static async getAllOrderCompany(request, response) {
        try {
            const driver_id = request.query.driver_id; // Use request.query to access query parameters
    
            console.log(`company Id ${driver_id}`);
    
            const result = await driver.getAllDriverNotificationById(driver_id); // Await the asynchronous operation
    
            if (result && result.length>0) {
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

    static async getAllDriverNotification(request , response){

        const driverId =  Number(request.query.driverId);
 
        console.log(driverId)
        try{
 
       const result = await driver.getAllDriverNotificationById(driverId);
 
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

     static async acceptOrCancelOrder(request , response){

         const {order_status  , driver_id , order_id , company_id } = request.body;
        
             const result = await driver.updateOrder_AcceptORCancelOrder(order_status , order_id , response , driver_id , company_id);
 
             if(result){
                 response.status(200).json({
                     status: true,
                     message: "Success update",
                     data: result,
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

     static async getAllUsersINChatDriver(request, response) {
        const driver_id = Number(request.query.driver_id);
        const uniqueUsers = new Set();
        const finalUserList = [];
        try {
            const result = await driver.getAllUsersChat();
    
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    if (
                        (result[i].sender_id === driver_id || result[i].reciver_id === driver_id) &&
                        (result[i].sender_type === "driver" || result[i].reciver_type === "driver")
                    ) {
                        const userId = result[i].sender_id === driver_id ? result[i].reciver_id : result[i].sender_id;
                        const userType = result[i].sender_id === driver_id ? result[i].reciver_type : result[i].sender_type;
    
                        // Create a unique user key based on user ID and user type
                        const userKey = `${userId}-${userType}`;
    
                        // Add the user to the Set if it's unique
                        uniqueUsers.add(userKey);
                        console.log(uniqueUsers)
                    }
                }
    
                // Iterate through unique user keys and retrieve user information
                for (const userKey of uniqueUsers) {
                    const [userId, userType] = userKey.split('-');
                    const user = await usersModle.getUserById(userId, userType);
                    finalUserList.push(user);
                    console.log(`Final  ${user}`)
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

        const io = DriverController.io;

        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
       // Convert hours from 24-hour format to 12-hour format
       const formattedHours = hours % 12 || 12;
      const timeString = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

        try{
            const {message , sender_id , reciver_id , sender_type , reciver_type} = request.body;
           const result = await driver.sendMessage(message , sender_id , reciver_id , sender_type , reciver_type , timeString);
           const senderUser = await usersModle.getUserById(sender_id , "driver");

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

            const {sender_id , reciver_id ,reciver_type , sender_type } = request.body
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
            const result = await driver.deleteMessageByIdFromDataBase(id);

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

}
export default DriverController;