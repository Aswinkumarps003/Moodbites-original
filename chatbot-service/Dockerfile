# Use an official Node.js runtime as the parent image (slim for smaller size)
FROM node:20-slim

# Set the environment flag
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies, using --legacy-peer-deps to handle potential conflicts
RUN npm install --only=production --legacy-peer-deps

# Copy the application source code into the container
COPY . .

# Expose the port (Set to 3009 for the Chatbot Service)
EXPOSE 3009 

# Define the command to run the application
CMD ["npm", "start"]
