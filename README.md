# NexHire - AI Interview Platform 🚀

NexHire is an AI-powered mock interview and career growth platform built to help job seekers improve their interview skills. It analyzes resumes, generates personalized learning roadmaps, and conducts AI-driven mock interviews with real-time feedback.

This project was developed as a comprehensive full-stack application, utilizing a Microservices architecture and containerization for seamless deployment.

## ✨ Key Features
- **Authentication:** Secure Sign-up/Login using Firebase (Email/Password & Google Auth).
- **Resume Analyzer:** Upload a resume to get an AI-generated ATS score and feedback.
- **AI Mock Interviews:** Practice interviews customized to your role and experience level using the Groq AI API.
- **Learning Roadmaps:** Generate role-specific career roadmaps to prepare for target jobs.
- **Credit System:** Virtual "Interview Coins" integrated with a Razorpay mock payment gateway.

## 💻 Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend Microservices:** Node.js, Express.js
- **Databases:** MongoDB (Data Storage), Redis (Session Caching)
- **AI Integration:** Groq API (LLM)
- **DevOps & Deployment:** Docker, Docker Compose, AWS EC2, GitHub Actions (CI/CD), Nginx, Cloudflare

## 🏗️ Architecture
The backend is structured into independent microservices to ensure separation of concerns:
- **API Gateway:** Routes all frontend requests to the appropriate service and handles rate limiting and CORS.
- **Auth Service:** Manages user sessions using Redis.
- **Resume Service:** Handles file parsing and AI evaluation.
- **Interview Service:** Manages mock interview states and AI interactions.
- **Roadmap Service:** Generates career paths based on user input.
- **Billing Service:** Handles the mock payment gateway integration.

## 🛠️ Local Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- API Keys for Firebase, Razorpay, and Groq.

### 2. Clone the Repository
```bash
git clone https://github.com/akhandps1/ai-interview-platform.git
cd ai-interview-platform
```

### 3. Environment Variables (.env)
Create a `.env` file in the root directory and add the following keys:
```env
# Databases (Docker URLs)
AUTH_MONGODB_URL=mongodb://mongodb:27017/auth_db
RESUME_MONGODB_URL=mongodb://mongodb:27017/resume_db
INTERVIEW_MONGODB_URL=mongodb://mongodb:27017/interview_db
ROADMAP_MONGODB_URL=mongodb://mongodb:27017/roadmap_db
BILLING_MONGODB_URL=mongodb://mongodb:27017/billing_db
REDIS_URL=redis://redis:6379

# API Keys
GROQ_API_KEY=your_groq_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
YOUTUBE_API_KEY=your_youtube_api_key
VITE_FIREBASE_APIKEY=your_firebase_api_key

# URLs
FRONTEND_PUBLIC_URL=http://localhost
FRONTEND_URL=http://localhost
GATEWAY_PUBLIC_URL=http://localhost:8000
```

### 4. Run with Docker
The easiest way to run the entire platform locally is using Docker Compose:
```bash
docker-compose up --build
```
Once the containers are running, access the platform at `http://localhost`.

## 🚀 Deployment
The project is deployed on an **AWS EC2 instance**. 
- **CI/CD:** Automated deployments are set up using GitHub Actions. Pushing to the `main` branch automatically rebuilds the updated code on the server.
- **Reverse Proxy & Security:** Nginx handles internal routing, and Cloudflare provides DNS management and SSL (HTTPS) termination.
