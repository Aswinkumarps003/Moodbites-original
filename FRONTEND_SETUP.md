# Frontend Setup for Google OAuth

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Other Configuration
VITE_ENV=development
```

## Getting Your Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API
4. Go to "APIs & Services" > "Credentials"
5. Click "Create Credentials" > "OAuth 2.0 Client IDs"
6. Choose "Web application"
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
8. Copy the Client ID and paste it in your `.env` file

## Testing Google Sign-In

1. Start your backend server:
   ```bash
   cd user-service
   npm run dev
   ```

2. Start your frontend application:
   ```bash
   cd frontend
   npm start
   ```

3. Navigate to `/login` or `/signup`
4. You should see the Google Sign-In button
5. Click it to test the OAuth flow

## Troubleshooting

### Google Sign-In Button Not Appearing
- Check that `VITE_GOOGLE_CLIENT_ID` is set correctly
- Check browser console for errors
- Verify the Google script is loading

### "Invalid Client ID" Error
- Verify your Google Client ID is correct
- Check that the domain is authorized in Google Cloud Console
- Ensure you're using the correct Client ID for your environment

### "Redirect URI Mismatch" Error
- Add your domain to authorized redirect URIs in Google Cloud Console
- Include both `http://localhost:3000` and `https://yourdomain.com`

### "process is not defined" Error
- This error occurs when using `process.env` instead of `import.meta.env` in Vite
- Make sure to use `VITE_` prefix for environment variables
- Restart your development server after changing environment variables

## Features Implemented

### Login Page (`/login`)
- ✅ Google Sign-In button
- ✅ Loading states
- ✅ Error handling
- ✅ Automatic navigation after success

### Signup Page (`/signup`)
- ✅ Google Sign-In button
- ✅ Loading states
- ✅ Error handling
- ✅ Success message display
- ✅ Automatic navigation after success

### Security Features
- ✅ Server-side token verification
- ✅ Secure user creation
- ✅ Proper error handling
- ✅ Environment variable validation

### User Experience
- ✅ Consistent styling across pages
- ✅ Loading indicators
- ✅ Clear error messages
- ✅ Smooth animations
- ✅ Responsive design 