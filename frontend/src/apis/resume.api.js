/**
 * FILE: frontend/src/apis/resume.api.js
 * PURPOSE: Contains API wrapper functions for interacting with the Resume microservice.
 */
import api from "../utils/axios"



export const getResume = async () => {
    try {
        const response = await api.get("/api/resume/get-resume")
        
        return response.data
    } catch (error) {
     
        return null
    }
    
}