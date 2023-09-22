import { error } from "console";
import clientModle from "../modles/client.js"
import usermodle from "../modles/users.js"


class ClientController{

    static setIO(io){
        ClientController.io = io;
    }

    // انشاء طلب جديد
    static async newOrder(request, response) {
        let result = null;

        const io = ClientController.io;

        const {
          client_name,
          client_lat_location,
          client_long_location,
          company_lat_location,
          company_long_location,
          phone_num,
          buy_cylinder,
          number_cylinders,
          total_buy_price,
          filling_cylinder,
          packing_quantity,
          total_fill_price,
          company_name,
          company_id,
          order_date,
          client_id,
          sender_image,
          client_address ,
          company_address
        } = request.body;
      
        // Check if any of the required fields are null or empty
        // التأكد لا يوجد  قيمة فارغة
        try{

            console.log("Phone " + phone_num)
            if (
                !client_name ||
                !client_lat_location ||
                !client_long_location ||
                !company_lat_location ||
                !company_long_location ||
                !phone_num ||
                !buy_cylinder ||
                !number_cylinders ||
                !total_buy_price ||
                !filling_cylinder ||
                !packing_quantity ||
                !total_fill_price ||
                !company_name ||
                !company_id ||
                !order_date ||
                !client_id ||
                !client_address ||
                !company_address
              ) {
                // Respond with an error status code and message
                response.status(401).json({
                  status: false,
                  message: "Unsuccess There is contain a null value",
                  data: null
                });
      
              } else {
                // All required fields are present and not empty, proceed with your logic here
                // The math module contains a function
                // named toRadians which converts from
                // degrees to radians.
      
                // يتم حساب المسافة عن طريق خطوط الطول و العرض
                let client_long_location_radians = client_long_location * (Math.PI / 180);
                let company_long_location_radians = company_long_location * (Math.PI / 180);
                let client_lat_location_radians = client_lat_location * (Math.PI / 180);
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
                const total_price	= total_buy_price + total_fill_price;
                const order_status = "waiting";
      
                 result = await clientModle.addOrderToDataBase( client_name,
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
                    0 , // الوقت المقدر لوصول الطلب
                    sender_image , 
                    client_address , 
                    company_address);
      
                  if(result){
                    response.status(200).json({
                        "status":true,
                        "message":"Success Add Order",
                        "data":null
                     });


                     io.on('connection', (socket) => {
                        console.log('User connected');
                      
                        // Listen for chat messages
                        socket.on(`notification${company_id}` , (msg) => {
                          io.emit(`notification${company_id}`, msg); // Broadcast the message to all connected clients
                        });
                      
                        // Listen for disconnections
                        socket.on('disconnect', () => {
                          console.log('User disconnected');
                        });
                      });

                      
                    //   io.on("connection" , (socket)=>{
                    //     console.log(socket.handshake.query.userName)


                        
                    //     io.emit(`${company_id}` , {
                    //         "client_name": client_name,
                    //         "phone_num": phone_num,
                    //     })
                    //   })

                  }else{
                    console.log("this Error")
                    response.status(401).json({
                        "status":false,
                        "message":error,
                        "data":result
                     });        
                              }

      
              }

        }catch(error){

             // You can still access the result variable here if needed
    console.error("Error:", error);
    console.log(`Error  ${error}`);

            response.status(500).json({
                "status":false,
                "message":error,
                "data":result
             });
        }

      }
     
      // جلب تفاصيل الطلب عن طريق id
      static async getOrderById(request , response){
        const order_num = request.params.order_num; // Access the specific
        console.log("Order Num  "+ order_num)
        if(order_num){
            console.log(order_num)
            const result = await clientModle.getOrderByIdFromDataBase(order_num);

            try{

                if(result && result.length > 0){
                    response.status(200).json({
                        "status":true,
                        "message":"Success",
                        "data":result
                     });
                }else{
                    response.status(401).json({
                        "status":false,
                        "message":"UnSuccess",
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
      }

      // جلب تفاصيل الطلب ل العميل
      static async getClientorderByID(request  , response){

        const client_id = request.query.client_id;
        console.log(client_id)
        if(client_id){

           const result  = await clientModle.getOrderClientbyIdFromDataBase(client_id);

           try{

            if(result && result.length > 0){
                response.status(200).json({
                    "status":true,
                    "message":"Success",
                    "data":result
                 });
            }
           }catch(error){
            response.status(401).json({
                "status":false,
                "message":"Un Success",
                "data":error
             });
           }
        }else{
            response.status(500).json({
                "status":false,
                "message":"Un Success",
                "data":error
             });
        }

      }

      // جلب جميع الطلبات
      static async getAllOrder(request , response){
        try{
            const result = await clientModle.getAllOrderFromDataBase();

            if(result && result.length > 0){
                response.status(200).json({
                    "status":true,
                    "message":"Success",
                    "data":result
                 });
            }else{
                response.status(401).json({
                    "status":false,
                    "message":"Un Success",
                    "data":null
                 });
            }
        }catch(error){
            response.status(500).json({
                "status":false,
                "message":"Un Success",
                "data":null
             });
        }
      }

    //   static async getAllUsersINChat(request, response) {
    //     const jsonList = [];
    //     try {
    
    //         const result = await clientModle.getAllUsersChat();
    
    //         if (result) {
    //             for (let i = 0; i < result.length; i++) {
    //                 let isRepeated = false;
    
    //                 for (let e = 0; e < jsonList.length; e++) {
    //                     if (
    //                         result[i].sender_id === jsonList[e].sender_id &&
    //                         result[i].receiver_id === jsonList[e].receiver_id 
    //                     ) {
    //                         isRepeated = true;
    //                         break;
    //                     }
    //                 }
    
    //                 if (!isRepeated && result[i].sender_type === "company" || result[i].sender_type === "driver"  && result[i].reciver_type === "client") {
                     
    //                     if(result[i].sender_id !== 142775268){
    //                         const result2 = await usermodle.getUserById(result[i].sender_id , result[i].sender_type);
    //                         jsonList.push(result2);

    //                         // for(let x=0 ; x<result2.length ; x++){

    //                         //     for(let f=0 ; f<jsonList.length ; f++){
    //                         //         if(result2[x].id !== jsonList[f].id){
    //                         //         }
    //                         //     }
    //                         // }
    //                     }
                        
    //                 }
    //             }
    
    //             response.status(200).json({
    //                 "status": true,
    //                 "message": "Success",
    //                 "data": jsonList
    //             });
    //         } else {
    //             response.status(401).json({
    //                 "status": false,
    //                 "message": "Unsuccessful",
    //                 "data": null
    //             });
    //         }
    //     } catch (error) {
    //         response.status(500).json({
    //             "status": false,
    //             "message": "Internal Server Error",
    //             "data": error
    //         });
    //     }
    // }

    static async getAllUsersINChat(request, response) {
        const client_id = Number(request.query.client_id);
        const uniqueUsers = new Set();
        const finalUserList = [];
        try {
            const result = await clientModle.getAllUsersChat();
    
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    if (
                        (result[i].sender_id === client_id || result[i].reciver_id === client_id) &&
                        (result[i].sender_type === "client" || result[i].reciver_type === "client")
                    ) {
                        const userId = result[i].sender_id === client_id ? result[i].reciver_id : result[i].sender_id;
                        const userType = result[i].sender_id === client_id ? result[i].reciver_type : result[i].sender_type;
    
                        // Create a unique user key based on user ID and user type
                        const userKey = `${userId}-${userType}`;
    
                        // Add the user to the Set if it's unique
                        uniqueUsers.add(userKey);
                    }
                }
    
                // Iterate through unique user keys and retrieve user information
                for (const userKey of uniqueUsers) {
                    const [userId, userType] = userKey.split('-');
                    const user = await usermodle.getUserById(userId, userType);
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
    
    static async getMessagesById(request , response){

        try{

            const {sender_id , reciver_id ,user_type } = request.body
            const result = await clientModle.getAllmessagesById(Number(sender_id) , Number(reciver_id) ,  user_type) ;

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
        const id = Number(request.params.id);

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

    static async sendMessage(request , response){

        const io = ClientController.io;

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
           const senderUser = await usermodle.getUserById(sender_id , "client");

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
    socket.on(`${reciver_id}` , (msg) => {
      io.emit(`${reciver_id}`, msg); // Broadcast the message to all connected clients
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


    static async evaluationsDriver(request , response)
    {
        const {evaluations , id} = request.body;
        try{
            const result = await clientModle.evaluationDriverById(evaluations , id);

            if(result){
                response.status(200).json({
                    status: true,
                    message: "Success Evaluate ",
                    data: null,
                });
            }else{
                response.status(401).json({
                    status: false,
                    message: "Un Success Evaluate ",
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
    
    



}
export default ClientController;