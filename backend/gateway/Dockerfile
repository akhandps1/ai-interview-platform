FROM node

WORKDIR /app

COPY package*json ./
RUN npm install

COPY gateway ./gateway
COPY shared ./shared

WORKDIR /app/gateway
RUN npm install

EXPOSE 8000
CMD [ "npm", "start" ]
