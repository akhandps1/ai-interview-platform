/**
 * FILE: services/auth/model/user.model.js
 * PURPOSE: Defines the MongoDB schema for a User.
 * This dictates what information is saved in the AuthDb for every person who signs up.
 */
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   // The unique ID provided by Firebase when the user signs in with Google/Email
   firebaseUid:{
      type:String,
      required:true,
      unique:true
   },

   name:String,

   email:{
      type:String,
      required:true,
      unique:true
   },

   // Coins act as the platform's currency. Users spend coins to do interviews or generate roadmaps.
   interviewCoin:{
      type:Number,
      default:150 // Give every new user 150 free coins to start
   }

},{
   // Automatically add 'createdAt' and 'updatedAt' timestamps
   timestamps:true
});

const User = mongoose.model("User", userSchema);

export default User;