FROM node:22-alpine

WORKDIR /app

# Install backend deps (cached layer)
COPY apps/backend/package.json apps/backend/package-lock.json* /app/apps/backend/
RUN cd /app/apps/backend && npm install

# Prisma schema is mounted in dev, but we copy for image completeness.
COPY prisma /app/prisma

EXPOSE 3001

WORKDIR /app/apps/backend
