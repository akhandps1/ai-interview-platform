/**
 * FILE: services/auth/index.js
 * PURPOSE: Main entry point for the Authentication Microservice.
 * This service handles user login, logout, and managing their "interview coins" (credits).
 */
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDb } from "./configs/db.js";
import dns from 'dns'
import authRouter from "./routes/auth.route.js";
dotenv.config();

const app = express();

// Middleware to parse incoming JSON data from requests
app.use(express.json());

// Middleware to read cookies (used for checking session IDs)
app.use(cookieParser());

const PORT = process.env.PORT || 6001

// Register all authentication-related routes (like /login, /logout) under the root path
app.use("/",authRouter);

// Start the server and connect to MongoDB
app.listen(PORT,() => {
    console.log( `Auth Service Started on ${PORT}`);
    connectDb() // Connects specifically to the AuthDb in MongoDB
  }
);