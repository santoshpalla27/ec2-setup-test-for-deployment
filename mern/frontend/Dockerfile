FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install express node-fetch@2
EXPOSE 3000
CMD ["node", "server.js"]
