import { error } from "console";
import clientModle from "../modles/client.js"
class ClientController{

    static async newOrder(request, response) {
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
          order_date
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
                !order_date
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
      
                const result = await clientModle.addOrderToDataBase( client_name,
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
                    company_long_location);
      
                  if(result){
                      response.status(200).json(result)
                  }else{
                      response.send("error")
                  }

      
              }

        }catch(error){
            response.send(error);

        }

      }
     
      
      static async getOrderById(request , response){
        const order_num = request.params.order_num; // Access the specific
        console.log("Order Num  "+ order_num)
        if(order_num){
            console.log(order_num)
            const result = await clientModle.getOrderByIdFromDataBase(order_num);

            try{

                if(result){
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

}
export default ClientController;