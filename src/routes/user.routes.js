import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const app=Router();

app.route('/register').post(upload.fields([{name:"avater",
    maxCount:1
},{
    name:"coverImage",
    maxCount:1
}]),registerUser)

export default app;//on next page ,we can only give it our own name if it is exported default