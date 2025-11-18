FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Create data directory
RUN mkdir -p /app/data

# Start server
CMD ["npm", "start"]
