# 📝 AI Interview Platform - Comprehensive Commenting & Development Analysis Plan

This document outlines the complete structural flow of the AI Interview Platform (Frontend + Backend) and provides a highly detailed, "Simple English" strategy for adding clean, human-readable development comments across the entire codebase. 

---

## 🏗️ 1. Project Structure & Flow Analysis

To write meaningful comments, we must first understand the exact flow of data and user interactions.

### 🖥️ Frontend (React + Vite) Flow
1. **Landing (`/src/pages/Home.jsx`)**: The entry point. Handles Firebase Auth (Login/Signup).
2. **Dashboard (`/src/pages/Dashboard.jsx`)**: The central hub. Fetches user data, credits, and links to all services.
3. **Interview Engine (`/src/pages/InterviewStart.jsx` -> `InterviewPage.jsx` -> `InterviewReport.jsx`)**:
   - Takes user input (tech stack, experience).
   - Initializes WebRTC/Microphone.
   - Communicates with Backend LLM (Groq) to conduct a dynamic voice/code interview.
   - Renders a final `InterviewReport` using Recharts.
4. **Resume Tools (`/src/pages/Scorer.jsx`, `/src/pages/ResumeBuilder.jsx`)**: Parses resumes, uses LLM to score them, and allows users to build new ones.
5. **Roadmap (`/src/pages/Roadmap.jsx`)**: Generates an AI-driven learning path based on user goals.
6. **Billing (`/src/pages/Billing.jsx`)**: Handles Razorpay payments and updates user credits.

### ⚙️ Backend (Node.js Microservices) Flow
1. **API Gateway (`/backend/gateway/`)**: Runs on Port 8000. Routes all incoming frontend traffic to the correct microservice. Handles global rate-limiting and JWT verification.
2. **Auth Service (`/backend/services/auth/`)**: Manages MongoDB `AuthDb`. Creates users, handles tokens.
3. **Interview Service (`/backend/services/interview/`)**: The core AI logic. Connects to Groq API, maintains conversation history in Redis, and stores results in `InterviewDb`.
4. **Resume Service (`/backend/services/resume/`)**: Processes PDF uploads, extracts text, scores via LLM, and stores in `ResumeDb`.
5. **Roadmap Service (`/backend/services/roadmap/`)**: Generates step-by-step JSON learning plans.
6. **Billing Service (`/backend/services/billing/`)**: Validates Razorpay webhooks and updates credits.

---

## 💬 2. Commenting Strategy (Simple English)

Good comments should explain **WHY** the code exists, not just **WHAT** it does. We will use 3 types of comments:

1. **File-Level (Docstrings):** Placed at the top of a file to explain its main purpose.
2. **Function-Level (JSDoc):** Placed above functions to explain inputs, outputs, and purpose.
3. **Inline (Logic-Level):** Placed inside complex code blocks to explain tricky logic in simple English.

---

## 📖 3. Comment Examples by Feature (What to actually write)

Here is exactly how you should comment the different parts of the project:

### A. Frontend: Interview Flow (`InterviewPage.jsx`)
```javascript
/**
 * FILE: InterviewPage.jsx
 * PURPOSE: This is the main interview screen where the user talks to the AI.
 * It handles the microphone, webcam, and sends user audio/text to the backend.
 */

// We use this state to know if the AI is currently talking, 
// so we can show the "Speaking..." animation to the user.
const [isAISpeaking, setIsAISpeaking] = useState(false);

/**
 * Sends the user's answer to the backend AI and gets the next question.
 * @param {string} userAnswer - The text the user just spoke or typed.
 */
const handleAnswerSubmit = async (userAnswer) => {
    // 1. Show loading spinner so user knows we are thinking
    setLoading(true);
    
    try {
        // 2. Call the Gateway API which routes to the Interview Microservice
        const response = await api.post('/interview/next-question', { answer: userAnswer });
        
        // 3. Play the AI's audio response
        playAudio(response.data.audioUrl);
    } catch (error) {
        // If API fails, show an error toast so the user isn't stuck
        toast.error("Failed to reach AI. Please try again.");
    } finally {
        setLoading(false);
    }
}
```

### B. Backend: API Gateway (`gateway/index.js`)
```javascript
/**
 * FILE: gateway/index.js
 * PURPOSE: This is the main entry point for the backend. 
 * ALL frontend requests hit this server first, and it redirects them to the correct microservice.
 */

// Middleware to check if the user is logged in before they can access secure routes
const requireAuth = require('./middleware/auth');

// Forward any requests starting with /api/interview to the Interview Microservice (running on port 8002)
app.use('/api/interview', requireAuth, createProxyMiddleware({ 
    target: 'http://localhost:8002', 
    changeOrigin: true 
}));
```

### C. Backend: AI Interview Service (`interview/controllers/llmController.js`)
```javascript
/**
 * Generates the next interview question using the Groq AI API.
 * It looks at the user's past answers to decide what to ask next.
 */
exports.generateNextQuestion = async (req, res) => {
    try {
        // 1. Get the interview history from Redis cache (much faster than MongoDB)
        const history = await redis.get(`interview:${req.user.id}`);
        
        // 2. Ask Groq LLM to generate a strict technical question
        const prompt = `You are a strict FAANG interviewer. The user just answered: ${req.body.answer}. Ask a follow-up question.`;
        const aiResponse = await groq.complete(prompt);
        
        // 3. Send the new question back to the frontend
        res.status(200).json({ question: aiResponse.text });
    } catch (error) {
        // Log the exact error for debugging, but send a simple message to the frontend
        console.error("Groq API Error:", error);
        res.status(500).json({ message: "AI is currently unavailable." });
    }
}
```

### D. Frontend: Billing (`Billing.jsx`)
```javascript
/**
 * Opens the Razorpay checkout modal.
 * We fetch a unique Order ID from our backend first, then pass it to Razorpay.
 */
const handlePayment = async (planId) => {
    // Prevent multiple clicks while loading
    if (isLoading) return; 
    setIsLoading(true);

    // Step 1: Create an order in our backend to securely log the attempt
    const order = await api.post('/billing/create-order', { planId });

    // Step 2: Configure the Razorpay popup window
    const options = {
        key: process.env.RAZORPAY_KEY_ID, // Public key safe for frontend
        amount: order.amount,
        order_id: order.id,
        handler: function (response) {
            // Step 3: If payment succeeds, tell our backend to add credits to the user's account
            verifyPaymentSuccess(response);
        }
    };
    
    // Open the popup
    const rzp = new window.Razorpay(options);
    rzp.open();
}
```

---

## 🗺️ 4. Execution Plan (How to apply this to the codebase)

If you want to implement these comments throughout the project, follow this 4-step plan:

- [ ] **Phase 1: Backend Gateway & Auth**
  - Add file-level comments to `gateway/index.js` and all proxy routes.
  - Comment the JWT token generation and validation logic in `services/auth`.
- [ ] **Phase 2: Core AI Logic (Interview & Resume)**
  - Comment the Prompt Engineering blocks (explain *why* the prompt is written that way).
  - Add inline comments to the Groq API calls and Redis caching logic.
- [ ] **Phase 3: Frontend Complex UI**
  - Comment the WebRTC/Microphone recording logic in `InterviewPage.jsx`.
  - Comment the state management (Zustand/Redux) so it's clear where data is coming from.
- [ ] **Phase 4: Billing & Webhooks**
  - Add strict comments explaining Razorpay webhook signature verification (critical for security).

By following this standard, any new developer (or even yourself in 6 months) will be able to read the code like a simple English book!
