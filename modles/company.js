import express from "express";
import db from "../db.js";
class Company{

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
      
}
export default Company;