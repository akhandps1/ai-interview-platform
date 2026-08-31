/**
 * FILE: backend/services/auth/routes/auth.route.js
 * PURPOSE: Express router defining endpoints for Google Auth login, logout, and coin management.
 */
import express from "express";
import {addCoins, login, logout, useInterviewCoins } from "../controllers/auth.controller.js";




const authRouter = express.Router();

authRouter.post("/login",login);

authRouter.get("/logout",logout)

authRouter.post("/add-coins",addCoins)

authRouter.post(
  "/use-coins",
  useInterviewCoins
);

export default authRouter;