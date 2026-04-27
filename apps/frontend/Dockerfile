FROM node:22-alpine

WORKDIR /app

# Install frontend deps (cached layer)
COPY apps/frontend/package.json apps/frontend/package-lock.json* /app/apps/frontend/
RUN cd /app/apps/frontend && npm install

EXPOSE 3000

WORKDIR /app/apps/frontend
