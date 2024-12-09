import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: proces.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //upload file on cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    }); // file has been uploaded succesfully
    console.log("File is Uploaded Successfully!!", cloudinaryResponse.url);

    return cloudinaryResponse;
  } catch (error) {
    fs.unlinkSync(localFilePath); //removes the loaclly saved temporary file as the upload operation has failed
    return null;
  }
};

export { uploadOnCloudinary }