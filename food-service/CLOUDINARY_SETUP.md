# Cloudinary Setup for Food Service

This guide will help you set up Cloudinary for recipe image uploads in the food-service backend.

## 🔧 Prerequisites

1. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com)
2. **Node.js**: Version 16 or higher
3. **Environment Variables**: Set up your `.env` file

## 📋 Environment Variables

Create a `.env` file in the `food-service` directory with the following variables:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Supabase Configuration (existing)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
PORT=5002
NODE_ENV=development
```

## 🚀 Installation

1. **Install Dependencies**:
   ```bash
   cd food-service
   npm install
   ```

2. **Get Cloudinary Credentials**:
   - Log in to your Cloudinary dashboard
   - Go to **Dashboard** → **Account Details**
   - Copy your **Cloud Name**, **API Key**, and **API Secret**

3. **Update Environment Variables**:
   - Replace the placeholder values in your `.env` file with your actual Cloudinary credentials

## 📁 Folder Structure

The Cloudinary setup creates the following folder structure:

```
moodbites-recipes/
├── recipe1.jpg
├── recipe2.png
└── ...
```

## 🔄 API Endpoints

### Upload Recipe Image
- **URL**: `POST /api/food/upload-recipe-image`
- **Content-Type**: `multipart/form-data`
- **Field Name**: `recipeImage`
- **Response**: 
  ```json
  {
    "message": "Recipe image uploaded successfully",
    "image_url": "https://res.cloudinary.com/your-cloud/image/upload/v12345/moodbites-recipes/recipe.jpg",
    "public_id": "moodbites-recipes/recipe"
  }
  ```

### Create Recipe with Image
- **URL**: `POST /api/food/dishes`
- **Content-Type**: `application/json`
- **Body**: Include the `image_url` from the upload response

## 🖼️ Image Processing

The Cloudinary configuration includes:
- **Folder**: `moodbites-recipes`
- **Formats**: jpg, jpeg, png, gif, webp
- **Transformations**: 
  - Resize to 800x600
  - Auto-crop with gravity detection
  - Auto-quality optimization
- **File Size Limit**: 10MB

## 🧪 Testing

1. **Start the server**:
   ```bash
   npm run dev
   ```

2. **Test image upload**:
   ```bash
   curl -X POST \
     -F "recipeImage=@/path/to/your/image.jpg" \
     http://localhost:5002/api/food/upload-recipe-image
   ```

3. **Check Cloudinary dashboard** to verify the image was uploaded to the `moodbites-recipes` folder

## 🔍 Troubleshooting

### Common Issues

1. **"Cloudinary upload did not return expected URL"**
   - Check your Cloudinary credentials in `.env`
   - Verify the image file is valid
   - Check the backend logs for detailed error information

2. **"Only image files are allowed"**
   - Ensure you're uploading an image file (jpg, png, gif, webp)
   - Check the file extension and MIME type

3. **"File too large"**
   - Reduce image size (current limit: 10MB)
   - Compress the image before upload

### Debug Logs

The backend logs detailed information about uploads:
```javascript
console.log('Recipe Cloudinary upload result:', JSON.stringify(req.file, null, 2));
```

Check your server console for this output when uploading images.

## 📝 Integration with Frontend

The frontend `SubmitRecipe.jsx` component is configured to:
1. Upload images to Cloudinary via the food-service
2. Use the returned `image_url` when creating recipes
3. Store the Cloudinary URL in the Supabase `image_url` field

## 🔒 Security Notes

- Cloudinary credentials are stored in environment variables
- File uploads are validated for type and size
- Images are processed and optimized automatically
- Public URLs are returned for Supabase storage 