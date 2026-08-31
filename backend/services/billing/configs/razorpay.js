/**
 * FILE: services/billing/configs/razorpay.js
 * PURPOSE: Initializes the Razorpay instance using our API keys.
 * This object is used to create orders and verify payments.
 */
import dotenv from "dotenv"
dotenv.config()
import Razorpay from "razorpay"

// Creates a Razorpay instance safely using our private credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export default razorpay