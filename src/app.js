import express from 'express';
const app=express();
import cookieParser from 'cookie-parser';
import cors from 'cors';

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,  //frontend url
        credentials: true
    }
))
app.use(express.json({limit:'16kb'}));

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

export default app;