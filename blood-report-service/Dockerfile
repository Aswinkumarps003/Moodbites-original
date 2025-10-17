# Use an official Node.js runtime as the parent image
FROM node:20-slim

# Set the environment flag
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies, using --legacy-peer-deps to handle known conflicts
# This handles the Node.js dependencies for connecting to MongoDB, etc.
RUN npm install --only=production --legacy-peer-deps

# Copy the application source code into the container
COPY . .

# Expose the port (Updated to 8000 for the Blood Report Service)
EXPOSE 8000 

# Define the command to run the main Node.js app
CMD ["npm", "start"]
