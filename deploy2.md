# 🐳 Easy Docker Deployment Guide (VPS / Dedicated Server)

If you find deploying 6 separate microservices on cloud providers difficult or expensive, **Docker is the best and 100% FREE alternative**. 

Using **Docker Compose**, you can deploy the **ENTIRE** platform (Frontend, API Gateway, 5 Microservices, MongoDB, and Redis) onto a single server (like AWS EC2, DigitalOcean Droplet, Hostinger VPS, etc.) with a single command!

I have already created the necessary files for you:
1. `docker-compose.yml` (Root Directory) - Orchestrates all 8 containers.
2. `frontend/Dockerfile` - Builds your Vite React app and serves it via Nginx.
3. `.env.example` - A centralized template for all your API keys.

---

## 🚀 Step 1: Prepare Your Server

1. **Rent a VPS:** Get a cheap Ubuntu VPS (e.g., from AWS, DigitalOcean, Hetzner, etc.). Make sure it has at least **2GB RAM** (4GB recommended for running all these microservices + DB).
2. **SSH into your server:** 
   ```bash
   ssh root@<YOUR_SERVER_IP>
   ```
3. **Install Docker & Docker Compose on the Server:**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose plugin
   sudo apt-get install docker-compose-plugin
   ```

## 📂 Step 2: Transfer Code & Configure Keys

1. Upload your entire project codebase to the server. You can do this by using `git clone <your-repo-url>` on the server.
2. Navigate into your project directory:
   ```bash
   cd AI-Interview-Platform
   ```
3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. **CRITICAL STEP:** Edit the `.env` file to add your API keys and Public IP.
   ```bash
   nano .env
   ```
   **Inside `.env` update these to your Server's Public IP:**
   - `FRONTEND_PUBLIC_URL=http://<YOUR_SERVER_IP>`
   - `GATEWAY_PUBLIC_URL=http://<YOUR_SERVER_IP>:8000`

   **Then, fill in your API Keys:**
   - `VITE_FIREBASE_APIKEY`
   - `GROQ_API_KEY`
   - `YOUTUBE_API_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`

## 🏗 Step 3: Build and Deploy!

With Docker Compose, all the hard work (setting up URLs, linking ports, managing MongoDB connections) is handled automatically inside the `docker-compose.yml` file.

1. **Start the Deployment (This will download images, build your code, and start everything):**
   ```bash
   docker compose up -d --build
   ```
   *Note: The first time you run this, it may take 3-5 minutes to build all the microservices and the React frontend.*

2. **Verify it's running:**
   ```bash
   docker compose ps
   ```
   You should see `gateway`, `auth`, `resume`, `interview`, `roadmap`, `billing`, `frontend`, `mongodb`, and `redis` all marked as **Up**.

## 🌐 Step 4: Access Your App

- **Frontend:** Open `http://<YOUR_SERVER_IP>` in your browser.
- **Backend APIs:** Are securely running on `http://<YOUR_SERVER_IP>:8000`.

*Note: Make sure port `80` and `8000` are open in your Server's Firewall / Security Groups.*

---

## 🛠 How this Architecture Works (Behind the scenes)

- **Self-Hosted Database & Cache:** I included official `mongo` and `redis` Docker images. Your microservices connect to `mongodb://mongodb:27017` and `redis://redis:6379` internally. No need for MongoDB Atlas!
- **Internal Microservice Networking:** The Gateway service points to `http://auth:8001`, `http://resume:8002`, etc. Docker handles DNS resolution internally. 
- **Production React Build:** The new `frontend/Dockerfile` I created compiles your Vite app into static HTML/JS and serves it lightning fast using an NGINX web server.
