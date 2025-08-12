# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server source code
COPY . .

# Expose the port your server runs on
EXPOSE 4000

# Start the server
CMD ["npm", "start"]