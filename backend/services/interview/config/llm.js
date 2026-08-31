/**
 * FILE: backend/services/interview/config/llm.js
 * PURPOSE: Core logic and configuration for llm.js.
 */

import { ChatGroq } from "@langchain/groq"
import dotenv from "dotenv"
dotenv.config()

const llm = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0.2,
    maxRetries: 2,
    maxTokens: 8192,
})

export default llm