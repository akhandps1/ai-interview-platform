/**
 * FILE: services/resume/controllers/resume.controller.js
 * PURPOSE: Manages the flow of uploading a PDF resume, extracting text, scoring it via AI, 
 * saving to MongoDB, caching in Redis, and finally deleting the local PDF file.
 */
// PDF Flow: Upload -> Extract Text -> LLM (Resume Agent) -> Save to MongoDB -> Cache in Redis -> Delete local PDF
import redis from "../../../shared/redis/redis.js";
import { resumeAgent } from "../agents/resume.agent.js";
import extractText from "../config/pdf.js";
import Resume from "../models/resume.model.js";
import fs from "fs"


/**
 * Uploads a resume PDF, parses it, scores it with AI, and saves the data.
 */
export const uploadResume = async (req,res) => {
    let file = null;
    try {
        file = req.file;
        if(!file){
            return res.status(400).json({
                success:false,
                message:"Resume PDF is required"
            })
        }
        const userId = req.headers["x-user-id"];

          if(!userId){
            return res.status(400).json({
                success:false,
                message:"UserId is required"
            })
        }

        const resumeText = await extractText(file.path)

        const aiResponse = await resumeAgent(resumeText)

        const resumeData = JSON.parse(aiResponse)

        let resume = await Resume.findOne({userId})

        if(resume){
            Object.assign(resume,{
                ...resumeData,
                extractedText:resumeText

            }    
            )
            await resume.save()
        }else{
            resume = await Resume.create({
                userId,
                extractedText:resumeText,
                ...resumeData
            })
        }

        await redis.set(`resume:${userId}`,JSON.stringify(resume));

        fs.unlinkSync(file.path);

        return res.status(200).json({
            success:true,
            message:"Resume analyzed successfully",
            data:resume
        })

        
    } catch (error) {
        console.log(error)

        if(file){
            fs.unlinkSync(file.path);
        }
        return res.status(500).json({
            success:false,
            message:error.message,
        })
        
    }
}


/**
 * Fetches the user's parsed resume data, first checking Redis cache for speed, then MongoDB.
 */
export const getResume = async (req,res) => {
    try {
        const userId = req.headers["x-user-id"];

    const cache = await redis.get(`resume:${userId}`)

    if(cache){
        return res.status(200).json({
            success:true,
            source:"redis",
            data:JSON.parse(cache)
        })
    }
    const resume = await Resume.findOne({userId})

    if(!resume){
        return res.status(404).json({
            success:false,
            message:"resume not found"
        })
    }

    await redis.set(`resume:${userId}`,JSON.stringify(resume));
   

     return res.status(200).json({
            success:true,
            source:"mongoDb",
            data:resume
        })
        
    } catch (error) {
        console.log(error)
         return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    


}