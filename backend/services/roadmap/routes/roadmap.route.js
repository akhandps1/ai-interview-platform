/**
 * FILE: backend/services/roadmap/routes/roadmap.route.js
 * PURPOSE: Express router defining endpoints for generating and retrieving AI roadmaps.
 */
import express from "express"
import { generateRoadmap, getAllRoadmap, getRoadmapbyId } from "../controllers/roadmap.controller.js"

const roadmapRouter = express.Router()

roadmapRouter.post("/generate" , generateRoadmap)

roadmapRouter.get("/all" ,getAllRoadmap )

roadmapRouter.get("/:id",getRoadmapbyId)

export default roadmapRouter