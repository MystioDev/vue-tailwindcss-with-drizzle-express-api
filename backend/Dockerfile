FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY drizzle.config.js ./
COPY drizzle/ ./drizzle/
COPY src/ ./src/

# Expose backend port (configured via BACKEND_PORT from .env)
ARG BACKEND_PORT=3000
EXPOSE ${BACKEND_PORT}

# Start Express server
CMD ["npm", "start"]

