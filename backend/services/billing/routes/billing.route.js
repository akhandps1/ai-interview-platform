/**
 * FILE: backend/services/billing/routes/billing.route.js
 * PURPOSE: Express router defining endpoints for creating Razorpay orders and verifying webhooks.
 */
import express from "express"
import { createOrder, verifyPayment } from "../controllers/billing.controller.js"

const billingRouter = express.Router()


billingRouter.post("/create",createOrder)
billingRouter.post("/verify",verifyPayment)

export default billingRouter