/**
 * FILE: backend/shared/redis/redis.js
 * PURPOSE: Establishes a singleton Redis connection using `ioredis`.
 * Shared across microservices for caching (e.g., Roadmaps) and session management.
 */
import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL)

redis.on("connect" , ()=>{
    console.log("redis connected")
})

export default redis