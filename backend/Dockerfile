FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY drizzle.config.js ./
COPY drizzle/ ./drizzle/
COPY src/ ./src/

# Build arguments from .env
ARG BACKEND_PORT=3000
ARG PROJECT_NAME=fullstack
ENV PROJECT_NAME=$PROJECT_NAME
EXPOSE ${BACKEND_PORT}

# Start Express server
CMD ["npm", "start"]

