FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# FIX: Added --legacy-peer-deps flag to resolve conflicts 
# between 'cloudinary' and 'multer-storage-cloudinary' during install.
RUN npm install --only=production --legacy-peer-deps && npm cache clean --force

COPY . .

EXPOSE 5002

CMD ["npm", "start"]

