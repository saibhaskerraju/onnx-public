FROM node:22-bookworm AS dev
WORKDIR /app
COPY package*.json ./

RUN npm install
ENV NODE_ENV=development