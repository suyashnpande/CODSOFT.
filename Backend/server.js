import app from "./app.js";
import dotenv from 'dotenv';
import cloudinary from "cloudinary";


// Load environment variables
dotenv.config();

  // Cloudinary setup
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
  });
  


//app connect--
app.listen(process.env.PORT , ()=>{
    console.log(`Server running on port ${process.env.PORT} `);
});

