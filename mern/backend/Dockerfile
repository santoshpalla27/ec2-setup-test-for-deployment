FROM node:18-alpine
WORKDIR /app
COPY server.js .
RUN npm install express node-fetch
EXPOSE 3001
CMD ["node", "server.js"]
