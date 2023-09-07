import { resolve } from "path";
import db from "../db.js";
import { error } from "console";

class ClientModel {
    static async addOrderToDataBase(
        client_name,
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
        company_long_location
    ) {
        return new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO client_orders (client_name, client_lat_location, client_long_location, phone_num, buy_cylinder, number_cylinders, total_buy_price, filling_cylinder, packing_quantity, total_fill_price, dilvery_price, order_status, company_name, order_date, total_price, company_lat_location, company_long_location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    client_name,
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
                ],
                (error, result) => {
                    if (error) {
                        console.error("Error inserting data:", error);
                        reject(error);
                    } else {
                        console.log("Data inserted successfully:", result);
                        resolve(result);
                    }
                }
            );
        });
    }

    static async getOrderByIdFromDataBase(order_num){
        return new Promise((resolve , reject)=>{
            db.query("SELECT * FROM client_orders WHERE order_num=?", [order_num], (error, result) => {
                if (!error) {
                    resolve(result);
                } else {
                    reject(error);
                }
            });
        })
    }
}

export default ClientModel;
