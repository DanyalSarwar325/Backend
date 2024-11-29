import mongoose, { connect } from 'mongoose';
import express from 'express';
import {DB_NAME} from './constants.js';
import {connectDB} from './db/db.config.js';
import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
 const PORT=process.env.PORT || 5000;
 console.log("PORT",PORT);


    connectDB()
    .then(()=>{
        app.listen(PORT,()=>{
            console.log(`Server is running on port `);
        })
    })
    .catch((err)=>{
        console.log("mongo connection failed",err);
    })

