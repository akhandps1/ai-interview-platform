/**
 * FILE: backend/gateway/controllers/user.controller.js
 * PURPOSE: Core logic and configuration for user.controller.js.
 */

export const getCurrentUser = async (req,res) => {
    try {
        return res.status(200).json({success:true , user:req.user})
    } catch (error) {
        console.log(error)
         return res.status(500).json({success:false , message:error.message
         })
    }
}