/**
 * FILE: gateway/utils/proxyWithHeaders.js
 * PURPOSE: A custom proxy wrapper that attaches the user's ID to the request headers 
 * before forwarding it to the internal microservices.
 */
import proxy from "express-http-proxy"

/**
 * Forwards requests to a microservice while injecting the authenticated user's ID.
 * Why: Microservices don't handle sessions themselves; the Gateway tells them who the user is via headers.
 * 
 * @param {string} serviceUrl - The internal URL of the target microservice.
 */
export const proxyWithHeaders = (serviceUrl) => {
  return proxy(
    serviceUrl,
    {
      // Intercept the request options right before sending it to the microservice
      proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        // If the 'isAuth' middleware successfully attached a user object...
        if (srcReq.user) {
          // ...add their ID to a custom header so the microservice knows who they are
          proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
        }
        return proxyReqOpts
      }
    }
  )
}