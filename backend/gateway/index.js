/**
 * FILE: gateway/index.js
 * PURPOSE: This is the main entry point for the API Gateway.
 * ALL frontend requests hit this server first. It checks rate limits,
 * handles some security (CORS), and redirects requests to the correct microservice.
 */
import express from "express"
import dotenv from "dotenv"
dotenv.config()
import proxy from "express-http-proxy"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import { getCurrentUser } from "./controllers/user.controller.js"
import { isAuth } from "./middleware/isAuth.js"
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js"

const app = express()
app.use(express.json()) // Automatically parse incoming JSON requests

/**
 * Rate Limiting configuration
 * Why: To prevent malicious users from spamming the API and crashing the servers.
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 200, // limit each IP to 200 requests per 15 minutes
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
// Apply the rate limiter to all routes
app.use(limiter);

// Setup CORS so only our frontend URLs can make requests to this backend
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
    credentials:true // Required to allow cookies to be sent back and forth
}))

// Morgan logs every request to the console for easy debugging
app.use(morgan("dev"))
// Parses cookies sent by the frontend so we can read session IDs
app.use(cookieParser())

const PORT = process.env.PORT || 6000

// Simple health check route
app.get("/" , (req,res)=>{
    res.send("Hello from Gateway")
})

/**
 * Microservice Proxy Routes
 * Any request to /api/xyz is forwarded to the correct microservice URL.
 * The 'isAuth' middleware checks if the user is logged in before letting them through (except for Auth).
 */
app.use("/api/auth" , proxy(process.env.AUTH_SERVICE_URL))
app.use("/api/resume" ,isAuth, proxyWithHeaders(process.env.RESUME_SERVICE_URL))
app.use("/api/interview",isAuth ,proxyWithHeaders(process.env.INTERVIEW_SERVICE_URL))
app.use("/api/roadmap",isAuth ,proxyWithHeaders(process.env.ROADMAP_SERVICE_URL))
app.use("/api/billing",isAuth ,proxyWithHeaders(process.env.BILLING_SERVICE_URL))

// Route to get the currently logged-in user's details
app.get("/api/me",isAuth,getCurrentUser)

// Start the gateway server (unless we are just running automated tests)
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT , ()=>{
        console.log(`Gateway Started on ${PORT}`)
    })
}

export default app;