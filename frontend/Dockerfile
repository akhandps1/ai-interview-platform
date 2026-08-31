FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We need to pass build arguments for vite env variables
ARG VITE_FIREBASE_APIKEY
ARG VITE_RAZORPAY_KEY_ID
ARG VITE_BACKEND_URL
ENV VITE_FIREBASE_APIKEY=$VITE_FIREBASE_APIKEY
ENV VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID
# We hardcode /api as the backend URL so Nginx can proxy it.
ENV VITE_BACKEND_URL=/api
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'server { \
    listen       80; \
    server_name  localhost; \
    location /api/ { \
        proxy_pass http://gateway:8000/api/; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
