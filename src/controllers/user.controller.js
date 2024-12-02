import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'

export const registerUser=asyncHandler( async (req,res)=>{
//get user details
const {username,email,password,fullName}=req.body;
//validations
if([username,fullName,password,email].some((field)=>
field?.trim()=="")){
    throw new ApiError(400, "All fields are required");
}
//if user already exists
const existingUser= await User.findOne({
    $or:[{username},{email}]
})
if(existingUser){
throw new ApiError(409,"User already exists")
}

const avatarLocalPath=req.files?.avatar[0]?.path; 
const coverImageLocalPath=req.files?.coverImage[0].path;

if(!avatarLocalPath){
    throw new ApiError(404,"Avatar is required")
}
//upload avatar and mage to cloudinary

const Avatar= await uploadOnCloudinary(avatarLocalPath);
const CoverImg= await uploadOnCloudinary(coverImageLocalPath);
if(!Avatar){
    throw new ApiError(404,"Avatar is missing")
}
const user=await User.create({
    username:username.toLowerCase(),
    email,
    password,
    avatar:Avatar.url,
    coverImage:CoverImg?.url||""
})
const createdUser=User.findById(_id).select("-password -refreshToken")
if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering User");
    
}
return res.status(200).json(
    new ApiResponse(200,createdUser,"User Created Sucessfully")

)





    res.status(200).json({
        message:"User Registered Sucessfully"
    })

})

