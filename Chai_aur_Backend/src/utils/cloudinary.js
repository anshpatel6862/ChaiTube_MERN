import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

// Configure dotenv only once
dotenv.config();

// Configure Cloudinary only once (duplicate config removed)
cloudinary.config({
 cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
});

const uploadOnCloudinary = async (localFilePath, folder = null) => {
  try {
    if (!localFilePath) {
      throw new Error("No file path provided");
    }

    // Check if file exists locally
    if (!fs.existsSync(localFilePath)) {
      throw new Error("File does not exist at provided path");
    }

    const uploadOptions = {
      resource_type: "auto",
      folder: folder, // Optional folder organization
      overwrite: true,
      invalidate: true
    };

    const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

    // File uploaded successfully, now delete local temp file
    fs.unlinkSync(localFilePath);
    console.log("✅ File uploaded to Cloudinary:", response.secure_url);
    
    return {
      url: response.secure_url,
      public_id: response.public_id,
      asset_id: response.asset_id
    };

  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error.message);
    
    // Remove temp file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw error; // Re-throw the error for handling in calling function
  }
};

export { uploadOnCloudinary };