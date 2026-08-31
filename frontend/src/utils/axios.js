/**
 * FILE: frontend/src/utils/axios.js
 * PURPOSE: Configures the global Axios instance. Attaches `withCredentials: true` 
 * to ensure that cross-origin cookies (from the Gateway) are sent with every request.
 */
import axios from "axios";


const api = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials:true
})

export default api