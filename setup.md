# 🛠️ Localhost Setup Guide for AI Interview Platform

This guide will walk you through setting up and running the complete AI Interview Platform on your local machine (`localhost`) with **all features functioning perfectly**.

Because this project uses a **Microservices Architecture**, there are 6 backend servers and 1 frontend server that need to communicate with each other. 

## 1. Prerequisites
Before starting, ensure you have the following installed on your machine:
* **Node.js** (v18 or higher)
* **Docker Desktop** (To easily run a local Redis server)
* **MongoDB Atlas Account** (Or a local MongoDB installation)

---

## 2. Generate Your API Keys
To run this project with all features, you must gather these free API keys:

1. **Firebase API Key:** Go to [Firebase Console](https://console.firebase.google.com/), create a project, enable Authentication, and copy the Web API Key.
2. **Groq API Key:** Go to [GroqCloud](https://console.groq.com/), create an account, and generate an API key (This powers the AI generation features).
3. **YouTube Data API Key:** Go to [Google Cloud Console](https://console.cloud.google.com/), enable YouTube Data API v3, and generate an API Key.
4. **Razorpay Keys:** Go to [Razorpay Dashboard](https://razorpay.com/), generate Test Keys (`Key ID` and `Key Secret`).
5. **MongoDB URL:** Get your connection string from MongoDB Atlas (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net`).

---

## 3. Configure `.env` Files (The Setup Keys)

You need to update **7 different `.env` files** in your project. Open each path in your code editor and replace the placeholder text with your actual keys. 

*(Note: The `localhost` ports are already configured correctly by default, you only need to add your keys).*

### 📁 1. Frontend (`frontend/.env`)
```env
VITE_FIREBASE_APIKEY="PASTE_YOUR_FIREBASE_API_KEY_HERE"
VITE_RAZORPAY_KEY_ID="PASTE_YOUR_RAZORPAY_KEY_ID_HERE"
VITE_BACKEND_URL="http://localhost:8000"
```

### 📁 2. API Gateway (`backend/gateway/.env`)
*You don't need to change anything here, but verify it looks like this:*
```env
PORT=8000
REDIS_URL="redis://localhost:6379"
AUTH_SERVICE_URL="http://localhost:8001"
RESUME_SERVICE_URL="http://localhost:8002"
INTERVIEW_SERVICE_URL="http://localhost:8003"
ROADMAP_SERVICE_URL="http://localhost:8004"
BILLING_SERVICE_URL="http://localhost:8005"
FRONTEND_URL="http://localhost:5173"
```

### 📁 3. Auth Service (`backend/services/auth/.env`)
```env
PORT=8001
MONGODB_URL="PASTE_YOUR_MONGODB_URL_HERE/AuthDb"
REDIS_URL="redis://localhost:6379"
```

### 📁 4. Resume Service (`backend/services/resume/.env`)
```env
PORT=8002
MONGODB_URL="PASTE_YOUR_MONGODB_URL_HERE/ResumeDb"
REDIS_URL="redis://localhost:6379"
GROQ_API_KEY="PASTE_YOUR_GROQ_API_KEY_HERE"
```

### 📁 5. Interview Service (`backend/services/interview/.env`)
```env
PORT=8003
MONGODB_URL="PASTE_YOUR_MONGODB_URL_HERE/InterviewDb"
REDIS_URL="redis://localhost:6379"
GROQ_API_KEY="PASTE_YOUR_GROQ_API_KEY_HERE"
```

### 📁 6. Roadmap Service (`backend/services/roadmap/.env`)
```env
PORT=8004
MONGODB_URL="PASTE_YOUR_MONGODB_URL_HERE/RoadmapDb"
REDIS_URL="redis://localhost:6379"
GROQ_API_KEY="PASTE_YOUR_GROQ_API_KEY_HERE"
YOUTUBE_API_KEY="PASTE_YOUR_YOUTUBE_API_KEY_HERE"
```

### 📁 7. Billing Service (`backend/services/billing/.env`)
```env
PORT=8005
MONGODB_URL="PASTE_YOUR_MONGODB_URL_HERE/BillingDb"
RAZORPAY_KEY_ID="PASTE_YOUR_RAZORPAY_KEY_ID_HERE"
RAZORPAY_KEY_SECRET="PASTE_YOUR_RAZORPAY_KEY_SECRET_HERE"
```

---

## 4. Install Dependencies

You must install `node_modules` for the frontend, gateway, and all 5 services. 
Open a terminal at the root of your project and run:

```bash
# Frontend
cd frontend && npm install && cd ..

# Gateway
cd backend/gateway && npm install && cd ../..

# Services
cd backend/services/auth && npm install && cd ../../..
cd backend/services/resume && npm install && cd ../../..
cd backend/services/interview && npm install && cd ../../..
cd backend/services/roadmap && npm install && cd ../../..
cd backend/services/billing && npm install && cd ../../..
```

---

## 5. Run the Project on Localhost!

### Step A: Start Local Redis Cache
Open a terminal in the `backend` folder and use the existing docker-compose file:
```bash
cd backend
docker-compose up -d
```
*(This starts Redis on `localhost:6379` in the background).*

### Step B: Start All Servers (Easy Method)
To avoid opening 7 different terminal windows, I have created a helper script for you. Run the following command from the root of your project:

```bash
# Make the script executable
chmod +x start-local.sh

# Run all servers simultaneously
./start-local.sh
```

### Alternatively (Manual Method):
If you prefer to see logs in separate windows, open 7 terminal tabs and run `npm run dev` (or `npm start`/`node index.js`) inside:
1. `/frontend` (`npm run dev`)
2. `/backend/gateway`
3. `/backend/services/auth`
4. `/backend/services/resume`
5. `/backend/services/interview`
6. `/backend/services/roadmap`
7. `/backend/services/billing`

## 🎉 You're Done!
Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**. 
Your complete AI Interview Platform is now running locally with all services connected!
