# Lightweight Node.js Alpine base
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Switch to non-root user
USER node

EXPOSE 5000

CMD ["node", "src/server.js"]
