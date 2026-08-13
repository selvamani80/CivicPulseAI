# Deployment Guide

CivicPulse AI is containerized and ready for Google Cloud Run or standard Docker environments.

## Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Cloud Run Container Execution
- Port 3000 is exposed and handled via reverse proxy.
- Secrets (`GEMINI_API_KEY`) are passed as environment variables.
