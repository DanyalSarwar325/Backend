import mongoose, { connect } from 'mongoose';
import express from 'express';
import {DB_NAME} from './constants.js';
import {connectDB} from './db/db.config.js';
import dotenv from 'dotenv';
dotenv.config();
const app=express();
// const PORT=process.env.PORT || 5000;
const PORT=3000;

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})