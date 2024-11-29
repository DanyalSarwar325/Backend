import {v2 as cloudinary} from "cloudinary"
import { log } from "console";
import fs from "fs"
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET// Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary=async(localpath)=>{
    try {
        
    
    if(!localpath) return null;
    //upload file to cloudinary
    const response = await cloudinary.uploader.upload(localpath,{
        resource_type:"auto"
    })
    console.log("File Sucessfully Uploaded on Cloudinary ",response.url)
    return response;
} catch (error) {
    fs.unlinkSync(localpath) //remove the locally saved  temporary file as upload operation got failed 
    return null;
        
}
}
export {uploadOnCloudinary}