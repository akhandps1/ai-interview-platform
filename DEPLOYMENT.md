# AI Interview Platform - Production Deployment Guide

This guide covers deploying the AI Interview Platform to production, utilizing **Vercel** for the Frontend and **Render** for the Backend Microservices & API Gateway. All `localhost` dependencies have been identified and need to be replaced with live URLs in production environments.

## 1. Architecture Overview
- **Frontend (Vite + React):** Deployed on [Vercel](https://vercel.com).
- **Backend (Node.js Microservices):** 6 individual Web Services (Gateway + 5 Services) deployed on [Render](https://render.com).
- **Database (MongoDB):** Hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Cache (Redis):** Hosted on Render Redis or [Upstash](https://upstash.com).

## 2. Prerequisites
Before starting the deployment, ensure you have active accounts and API keys for the following:
1. **GitHub/GitLab/Bitbucket:** To push your code (both Vercel and Render deploy via Git repositories).
2. **MongoDB Atlas:** Get your MongoDB Connection String(s). You can use one cluster and create different logical databases (e.g., `/?retryWrites=true&w=majority&appName=Cluster0`).
3. **Firebase:** Web API Key (for frontend auth).
4. **Razorpay:** Key ID and Key Secret.
5. **Groq API:** API key for AI features.
6. **YouTube API:** Data API v3 key.

## 3. Database & Cache Setup

### A. MongoDB Atlas
Create a cluster on MongoDB Atlas. In Network Access, allow access from anywhere (`0.0.0.0/0`) since Render IPs are dynamic.
- Base URL format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<DatabaseName>?retryWrites=true&w=majority`
- You will replace `<DatabaseName>` with specific database names for each service (e.g., `ai_auth`, `ai_resume`, etc.).

### B. Redis
Create a **Redis** instance on Render (if you have a paid account) OR use [Upstash](https://upstash.com/) for a free Serverless Redis.
- Copy the **Redis Connection URL** (e.g., `rediss://default:password@endpoint.upstash.io:6379`).

---

## 4. Backend Deployment on Render

You will create **6 separate Web Services** on Render. It is highly recommended to deploy the 5 microservices first, get their Render URLs, and then deploy the Gateway.

### Step 4.1: Deploy the 5 Microservices
For **each** of the services (`auth`, `resume`, `interview`, `roadmap`, `billing`), follow these steps on the Render Dashboard:

1. Click **New** -> **Web Service**.
2. Connect your Git repository.
3. Configuration:
   - **Name:** e.g., `ai-platform-auth`, `ai-platform-resume`, etc.
   - **Root Directory:** `backend/services/<service-name>` (e.g., `backend/services/auth`)
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. Add the specific **Environment Variables** for each service (See Section 6).

**Wait for these 5 services to be deployed and copy their `.onrender.com` URLs.**

### Step 4.2: Deploy the API Gateway
Once the 5 microservices are running, deploy the Gateway:

1. Click **New** -> **Web Service**.
2. Connect your Git repository.
3. Configuration:
   - **Name:** `ai-platform-gateway`
   - **Root Directory:** `backend/gateway`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
4. Add the **Environment Variables** for the Gateway (See Section 6).

**Copy the Gateway URL (e.g., `https://ai-platform-gateway.onrender.com`).**

---

## 5. Frontend Deployment on Vercel

1. Push your code to GitHub.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
3. Import your Git repository.
4. Configuration:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add the Frontend **Environment Variables** (See Section 6).
6. Click **Deploy**.

**Copy the Vercel URL (e.g., `https://ai-interview-platform.vercel.app`).**

---

## 6. Environment Variables Reference (Production ready `.env`)

Here are the complete `.env` configurations for each service for production. **Replace placeholder brackets `<...>` with actual keys/URLs.** 

### Frontend (`frontend/.env` variables for Vercel)
```env
VITE_FIREBASE_APIKEY="<your-firebase-api-key>"
VITE_RAZORPAY_KEY_ID="<your-razorpay-key-id>"
# This is your Render Gateway URL (NO trailing slash)
VITE_BACKEND_URL="https://ai-platform-gateway.onrender.com"
```

### Backend: Gateway (`backend/gateway/.env` variables for Render)
```env
# Render sets the PORT automatically.
# Use Upstash Redis URL or Render Internal Redis URL
REDIS_URL="<your-production-redis-url>"

# Internal or External URLs of the 5 deployed Render services
AUTH_SERVICE_URL="https://ai-platform-auth.onrender.com"
RESUME_SERVICE_URL="https://ai-platform-resume.onrender.com"
INTERVIEW_SERVICE_URL="https://ai-platform-interview.onrender.com"
ROADMAP_SERVICE_URL="https://ai-platform-roadmap.onrender.com"
BILLING_SERVICE_URL="https://ai-platform-billing.onrender.com"

# The Vercel domain for CORS
FRONTEND_URL="https://<your-vercel-app>.vercel.app"
```

### Backend: Auth Service (`backend/services/auth/.env`)
```env
MONGODB_URL="mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/AuthDb?retryWrites=true&w=majority"
REDIS_URL="<your-production-redis-url>"
```

### Backend: Roadmap Service (`backend/services/roadmap/.env`)
```env
MONGODB_URL="mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/RoadmapDb?retryWrites=true&w=majority"
REDIS_URL="<your-production-redis-url>"
GROQ_API_KEY="<your-groq-api-key>"
YOUTUBE_API_KEY="<your-youtube-api-key>"
```

### Backend: Resume Service (`backend/services/resume/.env`)
```env
MONGODB_URL="mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/ResumeDb?retryWrites=true&w=majority"
REDIS_URL="<your-production-redis-url>"
GROQ_API_KEY="<your-groq-api-key>"
```

### Backend: Interview Service (`backend/services/interview/.env`)
```env
MONGODB_URL="mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/InterviewDb?retryWrites=true&w=majority"
REDIS_URL="<your-production-redis-url>"
GROQ_API_KEY="<your-groq-api-key>"
```

### Backend: Billing Service (`backend/services/billing/.env`)
```env
MONGODB_URL="mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/BillingDb?retryWrites=true&w=majority"
RAZORPAY_KEY_ID="<your-razorpay-key-id>"
RAZORPAY_KEY_SECRET="<your-razorpay-key-secret>"
```

## 7. Post-Deployment Checklist
- [ ] Verify CORS: Ensure `FRONTEND_URL` in Gateway perfectly matches the Vercel URL (No trailing slash!).
- [ ] Database Connections: Make sure MongoDB Atlas IP access allows `0.0.0.0/0`.
- [ ] Redis Configuration: Ensure `REDIS_URL` is pointing to the managed Redis instance (Upstash/Render) for all services.
- [ ] API Communication: Verify the API Gateway successfully routes traffic to the 5 underlying microservices.
