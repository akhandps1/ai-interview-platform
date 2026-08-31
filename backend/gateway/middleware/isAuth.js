/**
 * FILE: gateway/middleware/isAuth.js
 * PURPOSE: This middleware checks if a user is logged in before they can access protected routes.
 * It reads the session cookie and verifies it against the Redis cache.
 */
import redis from "../../shared/redis/redis.js"

/**
 * Middleware function to authenticate requests.
 */
export const isAuth = async (req,res,next) => {
    try {
        // 1. Try to read the 'session' cookie sent by the user's browser
        const sessionId = req.cookies?.session

        // If no session ID is found, the user is not logged in
        if(!sessionId){
            return res.status(401).json({message:"Unauthorized"})
        }

        // 2. Check Redis to see if this session ID is valid and active
        const session = await redis.get(`session:${sessionId}`)

        // If Redis doesn't have it, the session has expired or is invalid
        if(!session){
            return res.status(401).json({message:"Session Expired"})
        }

        // 3. Attach the user data to the request so downstream microservices know who is making the request
        req.user = JSON.parse(session);

        // Move to the next middleware or route handler
        next();

    } catch (error) {
         // Catch any unexpected database or connection errors
         return res.status(500).json({message:error.message});
    }
}