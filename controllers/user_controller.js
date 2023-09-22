import usersModle from "../modles/users.js";
import nodemailer from 'nodemailer'; // Use import here
let verificationCode = '';

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mahmoud8371997@gmail.com',
            pass: 'tfjmndxzbqcnzzdn',
        },
    });


class Userscontroller{


    // جلب جميع المستخدمين
    static async getClient(request , response){


            const result = await usersModle.getClientUsers();
            if(result){

            
            //   companyAccount = result.filter((item)=> item.user_type === "company");

                // if(result.user_type === "company"){
                //     console.log("Result user type :"+result);

                //     response.status(200).json({
                //         "status":true,
                //     "message":"Success Get All Users",
                //     "data":{
                //         "id": result.id,
                //         "name": result.name,
                //         "user_type": result.user_type,
                //         "email": result.email,
                //         "pass": result.pass,
                //         "verificationCode": result.verificationCode,
                //         "lat_location": result.lat_location,
                //         "long_location": result.long_location,
                //         }
                   
                //     });
                // }else{
                    response.status(200).json({
                        "status":true,
                        "message":"All Client Users",
                        "data": result
                    }); 
                    
        
               
            


            }else{
                response.status(404).json({
                    "status":false,
                    "message":"Not Found",
                    "data":null
                });
            }
     
      
    }

 //  جلب جميع المستخدمين شركة
     static async getCompany(request , response){

        
        const result = await usersModle.getCompanyUsers();
        if(result){

                response.status(200).json({
                    "status":true,
                    "message":"All Company Users",
                    "data": result
                }); 
                
    
           
        


        }else{
            response.status(404).json({
                "status":false,
                "message":"Not Found",
                "data":null
            });
        }
 
  
}

//  جلب جميع المستخدمين سائقين
    static async getDriver(request , response){
        const result = await usersModle.getDriverUsers();
        if(result){

                response.status(200).json({
                    "status":true,
                    "message":"All Driver Users",
                    "data": result
                }); 
        }else{
            response.status(404).json({
                "status":false,
                "message":"Not Found",
                "data":null
            });
        }
}

// تسجيل عميل جديد
static async addClientAccount(request, response) {
    const { name, user_type, email, pass , address , client_lat_location , client_long_location} = request.body;

    try{
 // Check email format
 const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!emailPattern.test(email)) {
     response.status(400).send("Invalid email format");
     return;
 }

    // Generate a random 6-digit verification code
    verificationCode = Math.floor(100000 + Math.random() * 900000);
//  const result = await usersModle.addClient(name, user_type, email, pass , verificationCode);

//  if (result) {
//      response.status(200).json({
//         "status":true,
//         "message":"Success Add Users",
//         "data":null
//      });

     //اذا تمت العملية بنجاح يتم توليد رقم تحقق و ارساله للايميل المدخل من قبل المستخدم

     const mailOptions = {
        from: 'mahmoud8371997@gmail.com',
        to: email,
        subject: 'Verification code my_gas_app ',
        text: `Your verification code is: ${verificationCode}`,
    };

  
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        // response.status(200).json({
        //     "status":true,
        //     "message":"Success Verified ",
        //     "data":null
        //  });

       
         const result = await usersModle.addClient( Math.floor(100000000 + Math.random()*99999900) , name, user_type, email, pass , verificationCode , address , client_lat_location , client_long_location);

         if (result) {
                 response.status(200).json({
                    "status":true,
                    "message":"Success Add Users",
                    "data":null
                 });
                }

        return true; // Email sent successfully
    } catch (error) {
        response.status(404).json({
            "status":false,
            "message":error,
            "data":null
         });
        return false; // Failed to send email
    }

//     } else {
//      response.status(404).json({
//         "status":false,
//         "message":"Not Found",
//         "data":null
//      });
//  }
    }catch(error){
        response.status(500).json({
            "status":false,
            "message":error,
            "data":null
         });
    }

   
}

// تسجيل سائق جديد
// static async addDriverAccount(request, response) {
//     const { name, user_type, email, pass , vehicle_number , phone , lat_location , long_location} = request.body;

//     try{
//  // Check email format
//  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//  if (!emailPattern.test(email)) {
//      response.status(400).send("Invalid email format");
//      return;
//  }

//     // Generate a random 6-digit verification code
//     verificationCode = Math.floor(100000 + Math.random() * 900000);
//  const result = await usersModle.addDriver( Math.floor(100000000 + Math.random()*99999900) , name, user_type, email, pass  , verificationCode , vehicle_number , phone , lat_location , long_location);

//  if (result) {
//      response.status(200).json({
//         "status":true,
//         "message":"Success Add Users",
//         "data":null
//      });

//      //اذا تمت العملية بنجاح يتم توليد رقم تحقق و ارساله للايميل المدخل من قبل المستخدم

//     const mailOptions = {
//         from: 'mahmoud8371997@gmail.com',
//         to: email,
//         subject: 'Verification code my_gas_app ',
//         text: `Your verification code is: ${verificationCode}`,
//     };

   

  
//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.response);
//         response.status(200).json({
//             "status":true,
//             "message":"Success Verified ",
//             "data":null
//          });
   

     

//         return true; // Email sent successfully
//     } catch (error) {
//         response.status(404).json({
//             "status":false,
//             "message":e,
//             "data":null
//          });
//         return false; // Failed to send email
//     }

//     } else {
//      response.status(404).json({
//         "status":false,
//         "message":"Not Found",
//         "data":null
//      });
//  }
//     }catch(error){
//         response.status(500).json({
//             "status":false,
//             "message":error,
//             "data":error
//          });
//     }

   
// }
// تسجيل سائق جديد
static async addDriverAccount(request, response) {
    const { name, user_type, email, pass , vehicle_number , phone , lat_location , long_location} = request.body;

    try {
        // Check email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            return response.status(400).send("Invalid email format");
        }

        // Generate a random 6-digit verification code
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        const result = await usersModle.addDriver( Math.floor(100000000 + Math.random()*99999900) , name, user_type, email, pass, verificationCode, vehicle_number, phone, lat_location, long_location);

        if (result) {
            // اذا تمت العملية بنجاح يتم توليد رقم تحقق و ارساله للايميل المدخل من قبل المستخدم
            const mailOptions = {
                from: 'mahmoud8371997@gmail.com',
                to: email,
                subject: 'Verification code my_gas_app ',
                text: `Your verification code is: ${verificationCode}`,
            };

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log('Email sent:', info.response);
                return response.status(200).json({
                    "status": true,
                    "message": "Success Verified ",
                    "data": null
                });
            } catch (error) {
                console.error('Error sending email:', error);
                return response.status(500).json({
                    "status": false,
                    "message": error,
                    "data": null
                });
            }
        } else {
            return response.status(404).json({
                "status": false,
                "message": "Not Found",
                "data": null
            });
        }
    } catch (error) {
        return response.status(500).json({
            "status": false,
            "message": error,
            "data": error
        });
    }
}


// تسجيل شركة جديد
// static async addCompanyAccount(request, response) {
//     const { name, user_type, email, pass , company_registration_number , phone , lat_location , long_location} = request.body;

//     try{
//  // Check email format
//  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//  if (!emailPattern.test(email)) {
//      response.status(400).send("Invalid email format");
//      return;
//  }

//     // Generate a random 6-digit verification code
//     verificationCode = Math.floor(100000 + Math.random() * 900000);
//  const result = await usersModle.addCompany( Math.floor(100000000 + Math.random()*99999900) , name, user_type, email, pass  , company_registration_number  , phone , lat_location , long_location , verificationCode);

//  if (result) {
//      response.status(200).json({
//         "status":true,
//         "message":"Success Add Users",
//         "data":null
//      });

//      //اذا تمت العملية بنجاح يتم توليد رقم تحقق و ارساله للايميل المدخل من قبل المستخدم

//      const mailOptions = {
//         from: 'mahmoud8371997@gmail.com',
//         to: email,
//         subject: 'Verification code my_gas_app ',
//         text: `Your verification code is: ${verificationCode}`,
//     };

  
//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.response);
//         response.status(200).json({
//             "status":true,
//             "message":"Success Verified ",
//             "data":null
//          });
   

     

//         return true; // Email sent successfully
//     } catch (error) {
//         response.status(404).json({
//             "status":false,
//             "message":e,
//             "data":null
//          });
//         return false; // Failed to send email
//     }

//     } else {
//      response.status(404).json({
//         "status":false,
//         "message":"Not Found",
//         "data":null
//      });
//  }
//     }catch(error){
//         response.status(500).json({
//             "status":false,
//             "message":error,
//             "data":null
//          });
//     }

   
// }

static async addCompanyAccount(request, response) {
    const { name, user_type, email, pass , company_registration_number , phone , lat_location , long_location , address} = request.body;

    try{
 // Check email format
 const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!emailPattern.test(email)) {
     response.status(400).send("Invalid email format");
     return;
 }

    // Generate a random 6-digit verification code
    verificationCode = Math.floor(100000 + Math.random() * 900000);
 const result = await usersModle.addCompany( Math.floor(100000000 + Math.random()*99999900) , name, user_type, email, pass  , company_registration_number  , phone , lat_location , long_location , verificationCode , address);

 if (result) {
    // اذا تمت العملية بنجاح يتم توليد رقم تحقق و ارساله للايميل المدخل من قبل المستخدم
    const mailOptions = {
        from: 'mahmoud8371997@gmail.com',
        to: email,
        subject: 'Verification code my_gas_app ',
        text: `Your verification code is: ${verificationCode}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return response.status(200).json({
            "status": true,
            "message": "Success Verified ",
            "data": null
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return response.status(500).json({
            "status": false,
            "message": error,
            "data": null
        });
    }
} else {
    return response.status(404).json({
        "status": false,
        "message": "Not Found",
        "data": null
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



// تسجيل الدخول
static async loginUserByEmailPass(request, response) {
    const { email, pass, user_type } = request.body;
    const userType= user_type.toLowerCase();

    try {
        if (userType === "company" || userType === "client" || userType === "driver") {
            const user = await usersModle.loginUsersByEmailPass(email, pass, userType);

            if (user !== null) {
                response.status(200).json({
                    "status": true,
                    "message": "Success Login",
                    "data": user
                });
            } else {
                response.status(404).json({
                    "status": false,
                    "message": "Un Success Login",
                    "data": null
                });
            }
        } else {
            response.status(200).json({
                "status": true,
                "message": "Incorrect pass or email or user type",
                "data": null
            });
        }
    } catch (error) {
        // Handle any errors that occur during the asynchronous operation
        console.error("Error:", error);

        // Return a 401 status if there was an error related to authentication
        response.status(401).json({
            "status": false,
            "message": "Incorrect pass or email",
            "data": null
        });
    }
}



// اعادة ارسال رمز التحقق بعد ٦٠ دقيقة
    static async reSendverificationCode(request , response){
        const {email} = request.body;
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        const mailOptions = {
            from: 'mahmoud8371997@gmail.com',
            to: email,
            subject: 'Verification code my_gas_app ',
            text: `Your verification code is: ${verificationCode}`,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            response.status(200).json({
                "status":true,
                "message":"Success Send Verification Code",
                "data":null
             });
            return true; // Email sent successfully
        } catch (error) {
            response.status(404).json({
                "status":false,
                "message":error,
                "data":null
             });
            return false; // Failed to send email
        }

    }


    // التحقق من آن رمز التحقق صحيح
static async checkTheCodeIsVerified(request , response){
        const {email , verificationCode , user_type} =request.body;

        console.log(`The Verification Code is : ${verificationCode} ${email}`)

            const result = await usersModle.getUserByIdToVerifyAccount(email , user_type);

            console.log(`Result  : ${result.verificationCode}`)
            
        try{
            if (verificationCode !== null && verificationCode === result.verificationCode) {
                console.log(`try ${request.body}`)

                response.status(200).json({
                    "status": true,
                    "message": "Succes Verify",
                    "data": null
                  });
            } else {
                response.status(400) .json({
                    "status": false,
                    "message": "invalid verification code",
                    "data": null
                  });
            }
        }catch(error){
            console.log(`catch ${request.body}`)

            response.status(500).json({
                "status": false,
                "message": error,
                "data": null
              });
        }
}


static async updatePassowrd(request , response){

        const {email , pass , user_type} = request.body;
      try{

        if(user_type === "company" || user_type === "client" || user_type === "driver"){
            verificationCode = Math.floor(100000 + Math.random() * 900000);
            const result =   await usersModle.updatePasswordInDataBase(email , pass , user_type ,  verificationCode);
            if(result !== null){
    
                response.status(200).send("Sucess updated password");
        //اذا تمت العملية بنجاح يتم توليد رقم تحقق و ارساله للايميل المدخل من قبل المستخدم
         const mailOptions = {
            from: 'mahmoud8371997@gmail.com',
            to: email,
            subject: 'Verification code my_gas_app ',
            text: `Your verification code is: ${verificationCode}`,
        };
    
      
        try {
    
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
            response.status(200).json({
                "status": true,
                "message": "Success Verify",
                "data": null
              });
            return true; // Email sent successfully
    
        } catch (error) {
    
            console.error('Error sending email:', error);
            response.status(500).json({
                "status": false,
                "message": error,
                "data": null
              });
            return false; // Failed to send email
        }
            }else{
                response.status(400).json({
                    "status": false,
                    "message": "The Result null",
                    "data": null
                  });
            }

        }else{
            response.status(200).json({
                "status": false,
                "message": "Incorrect User Type",
                "data": null
              });
        }

       
      }catch(e){
        response.status(500).json({
            "status": false,
            "message": "Internal server error"+e,
            "data": null
          });
      }

    


}

static async updateUserInfo(request , response){

    try{

        const {name , image , phone , email , id} = request.body;

    if(id){
   const result = await usersModle.updateClientInfo(name , image , phone , email , id);
   console.log(result)
   if(result){
    response.status(200).json({
        "status": true,
        "message": "Success Update User Info",
        "data": null
      });
    }else{
        response.status(401).json({
            "status": false,
            "message": "Un Success",
            "data": null
          });
    }
    }else{
        response.status(400).json({
            "status": false,
            "message": "Un Success",
            "data": null
          });
    }

    }catch(error){
        response.status(500).json({
            "status": false,
            "message": error,
            "data": null
          });
    }
    
}

static async updateCompanyInfo(request , response){

    try{
       const {company_name , email , image , address , company_registration_number , id}= request.body;

    const result = await usersModle.updateCompany(image , company_registration_number  , address , email , company_name , id);

    if(result){
        response.status(200).json({
            "status": true,
            "message": "Success Update",
            "data": result
          });
    }else{
        response.status(401).json({
            "status": false,
            "message": "Un Success Update",
            "data": null
          });
    }


    }catch(error){
        response.status(500).json({
            "status": false,
            "message": error,
            "data": null
          });
    }
}

static async upDateClientlocation(request , response){
    const {lat_client , long_client , address , id} = request.body;

    try{
    const result = await usersModle.updateClientlocation(lat_client , long_client , address , id);

    if(result){
        response.status(200).json({
            "status": true,
            "message": "Success Update",
            "data": result
          });
    }else{
        response.status(401).json({
            "status": false,
            "message": "Un Success Update",
            "data": null
          });
    }


    }catch(error){
        response.status(500).json({
            "status": false,
            "message": error,
            "data": null
          });
    }

}

static async upDateDriverlocation(request , response){
    const {lat_client , long_client , id} = request.body;

    try{
    const result = await usersModle.updateDriverlocation(lat_client , long_client  , id);

    if(result){
        response.status(200).json({
            "status": true,
            "message": "Success Update",
            "data": result
          });
    }else{
        response.status(401).json({
            "status": false,
            "message": "Un Success Update",
            "data": null
          });
    }


    }catch(error){
        response.status(500).json({
            "status": false,
            "message": error,
            "data": null
          });
    }

}



} export default Userscontroller;