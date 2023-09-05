import express from "express"
import usersRoute from "./routes/users_routes.js"
import companyRoute from "./routes/company_routes.js"


// import nodemailer from 'nodemailer'; // Use import here

//     // Create a transporter using SMTP
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'mahmoud8371997@gmail.com',
//             pass: 'tfjmndxzbqcnzzdn',
//         },
//     });




//     // Function to send verification code email
// async function sendVerificationCode() {
//     const mailOptions = {
//         from: 'mahmoud8371997@gmail.com',
//         to: "sa1993.nassar@gmail.com",
//         subject: '2231234',
//         text: `Your verification code is: }`,
//     };

//     try {
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.response);
//         return true; // Email sent successfully
//     } catch (error) {
//         console.error('Error sending email:', error);
//         return false; // Failed to send email
//     }
// }

// sendVerificationCode();
const appExpress = express();
const port = process.env.port || 3500;
appExpress.use(express.json()); // Use express.json() middleware to parse JSON data

appExpress.use("/user" , usersRoute);
appExpress.use("/company" , companyRoute);


appExpress.listen(port , ()=>console.log("Runing on port num   "+port));