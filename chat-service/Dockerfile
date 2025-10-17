# Base image: Official Node.js LTS (slim for smaller image size)
FROM node:20-slim

# Set the environment variable to ensure logs are immediately flushed
# FIXED: Using key=value format to remove warning
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install dependencies using --legacy-peer-deps to handle known conflicts
# --only=production ensures dev dependencies are skipped to keep the image small
RUN npm install --only=production --legacy-peer-deps

# Copy the application source code into the container
COPY . .

# Expose the port (Updated to 3006 to match the application's runtime port)
EXPOSE 3006 

# Command to run the application (Updated for ES Module 'type: module' projects)
# We use 'node --loader' or ensure 'src/index.js' handles imports.
# Assuming you use 'import "dotenv/config";' or similar in src/index.js now.
# However, for simplicity and relying on the 'start' script:
CMD ["npm", "start"]
