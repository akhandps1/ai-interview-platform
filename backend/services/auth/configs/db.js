/**
 * FILE: backend/services/auth/configs/db.js
 * PURPOSE: Core logic and configuration for db.js.
 */
import mongoose from "mongoose"
export const connectDb= async()=>{
    try{
   await mongoose.connect(process.env.MONGODB_URL)
  console.log("DB Connected ")
}catch(err){
  console.error("Error connecting to MongoDB:", err)
    }
}