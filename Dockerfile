# This Dockerfile is for the server only
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server source code
COPY server/ .

# Expose the port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]