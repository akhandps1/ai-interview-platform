#!/bin/bash

echo "🚀 Starting AI Interview Platform locally..."

# Start Redis
echo "📦 Starting Redis container..."
cd backend
docker-compose up -d
cd ..

# Start Microservices
echo "⚙️ Starting Backend Services..."
(cd backend/services/auth && node index.js) &
(cd backend/services/resume && node index.js) &
(cd backend/services/interview && node index.js) &
(cd backend/services/roadmap && node index.js) &
(cd backend/services/billing && node index.js) &

# Start Gateway
echo "🚪 Starting API Gateway..."
(cd backend/gateway && node index.js) &

# Start Frontend
echo "🌐 Starting Frontend on http://localhost:5173..."
(cd frontend && npm run dev) &

echo "✅ All services are booting up! Press Ctrl+C to stop all services."

# Wait for all background processes
wait
