# Use an efficient base image
FROM node:20-slim 

# Set the environment flag
ENV NODE_ENV=production

# Set the directory inside the container
WORKDIR /app

# Copy the dependency files first (optimizes Docker caching)
COPY package*.json ./

# Install dependencies, using the fix for potential peer dependency conflicts
# This handles the multer/cloudinary conflicts we saw before.
RUN npm install --only=production --legacy-peer-deps 

# Copy the rest of the application source code (index.js, etc.)
COPY . .

# Expose the port the application listens on (Assuming 5003)
EXPOSE 5002

# Define the command to run the main application file 
CMD ["npm", "start"]
