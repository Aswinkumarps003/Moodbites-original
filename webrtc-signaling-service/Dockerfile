
# Use an efficient base image
FROM node:20-slim 

# Set the environment flag
ENV NODE_ENV=production

# Set the directory inside the container
WORKDIR /app

# Copy the dependency files first (optimizes Docker caching)
COPY package*.json ./

# Install dependencies, using the fix for potential peer dependency conflicts
# Since WebRTC Signaling often uses express/socket.io, --legacy-peer-deps is safer
RUN npm install --only=production --legacy-peer-deps 

# Copy the rest of the application source code (server.js, etc.)
COPY . .

# Expose the port the application listens on (Set to 3007)
EXPOSE 3007

# Define the command to run the main application file (assuming package.json has a "start" script)
CMD ["npm", "start"]
