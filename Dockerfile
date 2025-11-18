FROM node:18-alpine

WORKDIR /app

# Copy package files for both frontend and backend
COPY package*.json ./
COPY server/package*.json ./server/

# Install all dependencies
RUN npm install
RUN cd server && npm install

# Copy all source code
COPY . .

# Build the frontend
RUN npm run build

# Install nginx and supervisor to run both services
RUN apk add --no-cache nginx supervisor

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

# Create supervisor config to run both backend and nginx
RUN mkdir -p /var/log/supervisor
COPY supervisord.conf /etc/supervisord.conf

# Expose both ports (though nginx will handle frontend on 80)
EXPOSE 80 3001

# Start supervisor which will run both services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
