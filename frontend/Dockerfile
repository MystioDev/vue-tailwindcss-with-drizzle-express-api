# Stage 1: Build Vue application with Vite
FROM node:20-alpine AS build-stage

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build arguments from .env
ARG BACKEND_PORT=3000
ARG FRONTEND_PORT=5173
ARG PROJECT_NAME=fullstack
ENV BACKEND_PORT=$BACKEND_PORT
ENV FRONTEND_PORT=$FRONTEND_PORT
ENV PROJECT_NAME=$PROJECT_NAME

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve static production assets with Nginx
FROM nginx:alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Nginx 1.19+ automatically runs envsubst on /etc/nginx/templates/*.template
# and outputs the substituted config to /etc/nginx/conf.d/
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Backend port env var and envsubst filter for template substitution
ENV BACKEND_PORT=3000
ENV NGINX_ENVSUBST_FILTER=BACKEND_PORT

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
