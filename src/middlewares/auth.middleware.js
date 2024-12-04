import {ApiError} from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'

export const veriftJWT=asyncHandler(async (req,res,next)=>{
    try {
        const token=req.cookies?.accessToken||req.headers("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized User")
        }
        const decodedInfo=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        // const decodedInfo=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
       const user= await User.findById(decodedInfo?._id).select("-password -refreshToken")
    
       if(!user){
        //next video
        throw new ApiError(401,"invalid Token")
       }
       req.user=user;
       next();
    } catch (error) {
        throw new ApiError(400,"Error In verifying Token")
        
    }

})