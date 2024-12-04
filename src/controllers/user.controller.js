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
console.log(req.files);

const avatarLocalPath=req.files?.avatar[0]?.path; 
// const coverImageLocalPath=req.files?.coverImage[0].path;

console.log(avatarLocalPath);

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
    coverImageLocalPath=req.files.coverImage[0].path;
}
console.log(coverImageLocalPath);


if(!avatarLocalPath){
    throw new ApiError(404,"Avatar is required")
}
//upload avatar and mage to cloudinary

const Avatar= await uploadOnCloudinary(avatarLocalPath);
const CoverImg= await uploadOnCloudinary(coverImageLocalPath);
if(!Avatar){
    throw new ApiError(404,"Avatar is missing for cloudinary")
}
const user=await User.create({
    username:username.toLowerCase(),
    email,
    password,
    fullName,
    avatar:Avatar.url,
    coverImage:CoverImg?.url||""
})
const createdUser=User.findById(user._id).select("-password -refreshToken")
if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering User");
    
}

const userResponse = {
    _id: createdUser._id,
    username: createdUser.username,
    email: createdUser.email,
    fullName: createdUser.fullName,
    avatar: createdUser.avatar,
    coverImage: createdUser.coverImage,
    watchHistory: createdUser.watchHistory,
  };
return res.status(200).json(
    new ApiResponse(200,userResponse,"User Created Sucessfully")

)


})

const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user= await User.findById(userId);
        console.log(user);
        
        const accessToken= await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken();
        console.log(refreshToken);

        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}

        
    } catch (error) {
        console.log("Error in generating Tokens",error);
        
        
    }
}

export const LOGIN=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        console.log(username,email,password);
        if(!username && !email){
            throw new ApiError(400,"Provide username or email")
        }
        const user=await User.findOne({
            $or:[{email},{username}]
        })
        // console.log(user);
        
        if(!user){
            throw new ApiError(401,"User not exist")
        }
        
        const PasswordValid= await user.IsPasswordCorrect(password);
        console.log(PasswordValid);
        
        if(!PasswordValid){
            throw new ApiError(400,"Invalid Credentials")
        }
    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);
    // console.log(accessToken,refreshToken);
    
    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")
    // console.log(loggedInUser);
    
    

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(new ApiResponse(200,{
        user:loggedInUser,accessToken,refreshToken
    },"User LOgged Succesfully"))


    } catch (error) {
        new ApiError(401,"Login Failed")
        
    }
}

export const logoutUser=asyncHandler( async(req,res)=>{
   try {
     await User.findByIdAndUpdate(req.user._id,{$set:{
         refreshToken:undefined
     }},{new:true})
     const options={
         httpOnly:true,
         secure:true
     }
     res.status(200)
     .clearCookie("accessToken",options)
     .clearCookie("refreshToken",options)
     .json(new ApiResponse(200,{},"User logged out Sucessfully"))
   } catch (error) {
    throw new ApiError(500,"Error In logging")
   }


})
