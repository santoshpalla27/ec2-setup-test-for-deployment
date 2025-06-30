FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install express node-fetch
EXPOSE 3000
CMD ["node", "server.js"]
