# Google OAuth Setup for MoodBites

This guide will help you set up Google OAuth authentication for your MoodBites application.

## Prerequisites

- Google Cloud Console account
- Node.js and npm installed
- Your MoodBites application running

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API

## Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "MoodBites"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses)

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Copy the Client ID

## Step 4: Environment Variables

### Frontend (.env file in frontend directory)
```env
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### Backend (.env file in user-service directory)
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
JWT_SECRET=your-jwt-secret
MONGODB_URI=your-mongodb-connection-string
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=your-verified-sender-email
FRONTEND_URL=http://localhost:3000
```

## Step 5: Install Dependencies

### Backend (user-service directory)
```bash
npm install google-auth-library
```

### Frontend (frontend directory)
The Google Sign-In script is loaded dynamically, so no additional npm packages are needed.

## Step 6: Test the Implementation

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

3. Navigate to the signup or login page
4. Click the "Sign in with Google" button
5. Complete the Google OAuth flow

## Troubleshooting

### Common Issues:

1. **"Invalid Client ID" error**
   - Verify your Google Client ID is correct
   - Check that the domain is authorized in Google Cloud Console

2. **"Redirect URI mismatch" error**
   - Add your domain to authorized redirect URIs in Google Cloud Console
   - Include both `http://localhost:3000` and `https://yourdomain.com`

3. **"Google script not loading"**
   - Check browser console for network errors
   - Verify the Google script URL is accessible

4. **"Token verification failed"**
   - Ensure `GOOGLE_CLIENT_ID` is set correctly in backend .env
   - Check that the Google Auth Library is installed

### Debug Steps:

1. Check browser console for JavaScript errors
2. Check backend console for server errors
3. Verify all environment variables are set
4. Test with a different browser or incognito mode

## Security Considerations

1. **Never expose your Google Client Secret** - Only the Client ID is needed for frontend
2. **Use HTTPS in production** - Google OAuth requires secure connections
3. **Validate tokens server-side** - Always verify Google tokens on your backend
4. **Store user data securely** - Use proper encryption for sensitive data

## Production Deployment

1. Update authorized origins in Google Cloud Console with your production domain
2. Set environment variables on your production server
3. Use HTTPS for all OAuth redirects
4. Test the complete flow in production environment

## API Endpoints

### Google Sign-In
- **URL**: `POST /api/user/google-signin`
- **Body**: `{ "credential": "google-jwt-token" }`
- **Response**: `{ "message": "success", "user": {...}, "token": "jwt-token" }`

## User Schema Updates

The User model now includes:
- `googleId`: String (unique, sparse index)
- `isVerified`: Boolean (true for Google users)
- All existing fields remain unchanged

## Support

If you encounter issues:
1. Check the Google Cloud Console for API quotas and errors
2. Verify all environment variables are correctly set
3. Test with a fresh browser session
4. Check server logs for detailed error messages 