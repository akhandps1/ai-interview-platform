/**
 * FILE: services/billing/controllers/billing.controller.js
 * PURPOSE: Handles creating payment orders and verifying successful transactions.
 * Critical for security - ensures users don't fake their payments to get free coins.
 */
import razorpay from "../configs/razorpay.js";
import Billing from "../models/billing.model.js";
import crypto from "crypto"



const PLANS = {
    starter: {
        amount: 199,
        interviewCoins: 300,
    },
};

/**
 * Step 1 of Payment: Creates a secure order with Razorpay before the frontend opens the checkout popup.
 */
export const createOrder = async (req, res) => {
    try {
        const { planId } = req.body
        const userId = req.headers["x-user-id"]
        const plan = PLANS[planId]

        if (!plan) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan",
            });
        }

        // 1. Tell Razorpay to create a new order ID for this specific amount
        // Note: Razorpay expects the amount in the smallest currency unit (paise), so we multiply by 100
        const order = await razorpay.orders.create({
            amount: plan.amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        })

        await Billing.create({
            userId,
            amount: plan.amount,
            interviewCoins: plan.interviewCoins,
            razorpayOrderId: order.id,
            status: "created",
        })

        return res.status(201).json({
            success: true,
            order,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
        });
    }
}

/**
 * Step 2 of Payment: Verifies the payment signature returned by Razorpay to ensure it's authentic.
 * Why: Hackers can fake a "success" response. We use our RAZORPAY_KEY_SECRET to verify the cryptographic signature.
 */
export const verifyPayment = async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body

        const payment = await Billing.findOne({
            razorpayOrderId:razorpay_order_id
        })
        if(!payment){
             return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
        }

        // Generate our own signature using the secret key that only our backend and Razorpay know
        const genSign = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex")

        // If our signature doesn't match the one from the frontend, someone is trying to cheat
        if(genSign !== razorpay_signature){
            payment.status = "failed";
            await payment.save()
            return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
        }

        if (payment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    payment.status = "paid"
    payment.razorpayPaymentId = razorpay_payment_id
    payment.razorpaySignature = razorpay_signature

    await payment.save()

    return res.status(200).json({
      success: true,
      message: "Payment successful",
    });
    } catch (error) {

        console.log(error);

    if (req.body?.razorpay_order_id) {
      await Billing.findOneAndUpdate(
        {
          razorpayOrderId: req.body.razorpay_order_id,
        },
        {
          status: "failed",
        }
      );
    }

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });

    }
}
