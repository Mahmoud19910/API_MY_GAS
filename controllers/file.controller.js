// Import the necessary modules using ES module syntax
import fs from "fs";
import uploadFile from "../middleware/upload.js"; // Note the .js extension
import usersModle from "../modles/users.js";




const updateClientAndUploadImage = async (req, res) => {
    try {
      await uploadFile(req, res);
  
      // console.log(`Request Body: ${JSON.stringify(req.body)}`);
      const { name, phone, email, id } = req.body; // Extract the fields from the request body
  
      console.log(`First name: ${name}`);
  
      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      } else {
        const result = await usersModle.updateClientInfo(
          name,
          "http://localhost:4000/user/files/" + req.file.originalname,
          phone,
          email,
          id
        );
        if (result) {
          res.status(200).json({
            status: true,
            message: "Success Update User Info",
            data: null
          });
        } else {
          res.status(401).json({
            status: false,
            message: "Un Success",
            data: null
          });
        }
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    }
  };


  const updateCompanyAndUploadImage = async (req, res) => {
    try {
      await uploadFile(req, res);
  
      // console.log(`Request Body: ${JSON.stringify(req.body)}`);
      const {company_name , email , address , company_registration_number , id , phone}= req.body;

      console.log(`First name: ${email}`);
  
      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      } else {
        const result = await usersModle.updateCompany( "http://localhost:4000/user/files/" + req.file.originalname , company_registration_number  , address , email , company_name , Number(id) , phone);
  
      if(result){
          res.status(200).json({
              "status": true,
              "message": "Success Update",
              "data": result
            });
      }else{
          res.status(401).json({
              "status": false,
              "message": "Un Success Update",
              "data": null
            });
      }  
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    }
  };


  const updateDriverAndUploadImage = async (req, res) => {
    try {
      await uploadFile(req, res);
  
      // console.log(`Request Body: ${JSON.stringify(req.body)}`);
      const {driver_name , email , vehicle_number , phone  , driver_address , id}= req.body;

      console.log(`First name: ${email}`);
  
      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      } else {

        console.log(global.myGlobalVariable); // Access the global variable

        const result = await usersModle.updateDriver(driver_name , email , vehicle_number , phone , global.uploadImageBaseUrl + req.file.originalname , driver_address , id);
  
     if(result){
        res.status(200).json({
            "status": true,
            "message": "Success Update",
            "data": result
          });
    }else{
        res.status(401).json({
            "status": false,
            "message": "Un Success Update",
            "data": null
          });
    }

      }
    } catch (err) {
      res.status(500).send({
        message: `Could not upload the file: ${req.file.originalname}. ${err}`,
      });
    }
  };
  

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {

        console.log(`file name   ${file}`)
      fileInfos.push({
        name: file,
        url: "http://localhost:4000" + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

export default {
    updateClientAndUploadImage,
    updateCompanyAndUploadImage,
    updateDriverAndUploadImage,
  getListFiles,
  download,
};
