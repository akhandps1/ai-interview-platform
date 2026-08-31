/**
 * FILE: services/interview/agents/interview.agent.js
 * PURPOSE: This agent communicates directly with the LLM to generate the next interview question.
 */
import llm from "../config/llm.js"
import hrInterviewPrompt from "../prompts/hrInterviewPrompt.js"
import technicalInterviewPrompt from "../prompts/technicalInterviewPrompt.js"

/**
 * Invokes the LLM to get the next question based on user context.
 * 
 * @param {Object} data - Contains interview context (resume, past answers, type of interview).
 * @returns {Object} A parsed JSON object containing the next question.
 */
export const interviewAgent = async (data) => {

    let response;
    try {
        // 1. Choose the correct strictness/persona prompt depending on whether it's an HR or Technical round
        const prompt = data.type?.toLowerCase() === "hr" ? hrInterviewPrompt(data) : technicalInterviewPrompt(data)

        // 2. Send the prompt to the Groq LLM
        response = await llm.invoke(prompt)

        // 3. Clean up the response (sometimes LLMs add extra markdown tags like ```json)
        const cleaned = response.content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        // 4. Return the clean JSON to the frontend
        return JSON.parse(cleaned)
    } catch (error) {
        // If parsing fails (usually because the LLM didn't return perfect JSON), we log it here
        console.log("Interview Agent Parse Error", error);
        if (response) console.log(response.content);

        throw new Error("Failed to generate interview questions.");
    }
}