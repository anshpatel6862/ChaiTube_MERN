
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";



import dotenv from "dotenv";
dotenv.config();  // ❗ Yeh sabse upar hona chahiye

import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MONGODB connection failed", err);
  });









/*
import express from "express"
const app = express()

( async ()=> {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`app is listning on port ${process.env.PORT}`);
        })
    }
    catch (error){
        console.error("ERROR: ",error)
        throw err
    }
}) ()

*/