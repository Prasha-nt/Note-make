# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for your application.

## Prerequisites

1. A Google Cloud Console account
2. A project created in Google Cloud Console

## Step 1: Google Cloud Console Setup

### 1.1 Create a New Project (if you don't have one)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and select "New Project"
3. Enter a project name and click "Create"

### 1.2 Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google OAuth2 API" if available

### 1.3 Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type (unless you have Google Workspace)
3. Fill in the required information:
   - App name: Your application name
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes (optional for now)
5. Save and continue through all steps

### 1.4 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

## Step 2: Backend Configuration

### 2.1 Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-from-step-1.4
GOOGLE_CLIENT_SECRET=your-google-client-secret-from-step-1.4

# Frontend URL (for CORS and redirects)
CLIENT_URL=http://localhost:5173

# Email Configuration (for OTP functionality)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2.2 Install Dependencies
The required dependencies are already installed:
- `passport`
- `passport-google-oauth20`
- `express-session`

## Step 3: Frontend Configuration

### 3.1 Environment Variables
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

## Step 4: Running the Application

### 4.1 Start Backend
```bash
cd backend
npm run dev
```

### 4.2 Start Frontend
```bash
cd frontend
npm run dev
```

## Step 5: Testing Google OAuth

1. Open your browser and go to `http://localhost:5173`
2. Click on "Continue with Google" button
3. You'll be redirected to Google's authentication page
4. Sign in with your Google account
5. Grant permissions to your application
6. You'll be redirected back to your application with authentication completed

## How It Works

### Authentication Flow
1. User clicks "Continue with Google"
2. Frontend redirects to `http://localhost:5000/api/auth/google`
3. Backend redirects to Google OAuth consent screen
4. User authenticates with Google
5. Google redirects back to `http://localhost:5000/api/auth/google/callback`
6. Backend handles the callback, creates/updates user, generates JWT
7. Backend redirects to frontend success page with token
8. Frontend extracts token and stores it in localStorage
9. User is redirected to the welcome page

### User Linking Logic
- If a user signs in with Google and already has an account with the same email (created via OTP), the Google account will be linked to the existing user
- If it's a completely new user, a new account will be created
- Users can use either OTP-based login or Google OAuth interchangeably

## Production Deployment

When deploying to production:

1. Update the redirect URI in Google Cloud Console to your production URL
2. Update environment variables:
   - `CLIENT_URL` to your frontend production URL
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (same values)
3. Ensure HTTPS is enabled for OAuth to work properly

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Client Secret**: Keep your Google Client Secret secure and never expose it in frontend code
3. **HTTPS**: Use HTTPS in production for secure OAuth flow
4. **JWT Secret**: Use a strong, random JWT secret
5. **Session Secret**: Use a strong, random session secret

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" Error**
   - Ensure the redirect URI in Google Console exactly matches your backend callback URL
   - Check for trailing slashes or protocol mismatches

2. **"Access blocked" Error**
   - Make sure OAuth consent screen is properly configured
   - Check if your app is in testing mode and add test users

3. **CORS Errors**
   - Verify `CLIENT_URL` environment variable is set correctly
   - Ensure frontend and backend URLs match the environment configuration

4. **Authentication Loop**
   - Clear browser cookies and localStorage
   - Check if session secret is properly set

### Debugging Tips

1. Check browser network tab for failed requests
2. Look at backend console logs for detailed error messages
3. Verify all environment variables are loaded correctly
4. Test with different Google accounts

## Additional Features

The implementation includes:
- ✅ Google OAuth integration
- ✅ Existing OTP-based authentication preserved
- ✅ Account linking for users with same email
- ✅ JWT token generation for both auth methods
- ✅ Proper error handling and user feedback
- ✅ Responsive UI with Google button styling