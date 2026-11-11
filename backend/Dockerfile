FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY drizzle.config.js ./
COPY drizzle/ ./drizzle/
COPY src/ ./src/

# Expose backend port
EXPOSE 3000

# Start Express server
CMD ["npm", "start"]

