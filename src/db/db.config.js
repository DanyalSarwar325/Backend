import mongoose from "mongoose";
import {DB_NAME} from '../constants.js';
import dotenv from 'dotenv';
dotenv.config();


export const connectDB = async () => {
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("Database connected successfully , Host",connectionInstance.connection.host);
    } catch (error) {
        console.log("error",error);
        process.exit(1);
    }
}