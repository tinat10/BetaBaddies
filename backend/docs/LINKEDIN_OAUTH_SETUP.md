# LinkedIn OAuth Setup Guide

This guide will help you set up LinkedIn OAuth authentication for your ATS application.

## Prerequisites

1. A LinkedIn Developer Account
2. Access to LinkedIn Developer Portal
3. Your application running locally or deployed

## Step 1: Create a LinkedIn App

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Sign in with your LinkedIn account
3. Click "Create App"
4. Fill in the required information:
   - **App name**: Your application name (e.g., "ATS Tracker")
   - **LinkedIn Page**: Select a LinkedIn page (or create one)
   - **Privacy policy URL**: Your privacy policy URL
   - **App logo**: Upload your app logo
   - **Legal agreement**: Accept the terms

## Step 2: Configure OAuth Settings

1. In your LinkedIn app dashboard, go to the "Auth" tab
2. Under "OAuth 2.0 settings", add the following redirect URLs:

   - For development: `http://localhost:3001/api/v1/users/auth/linkedin/callback`
   - For production: `https://yourdomain.com/api/v1/users/auth/linkedin/callback`

3. Under "Products", request access to:
   - **Sign In with LinkedIn using OpenID Connect** (for basic profile and email)
   - **Share on LinkedIn** (optional, for sharing features)

## Step 3: Get Your Credentials

1. In the "Auth" tab, you'll find:

   - **Client ID**: Copy this value
   - **Client Secret**: Copy this value

2. Add these to your `.env` file:

```env
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_CALLBACK_URL=http://localhost:3001/api/v1/users/auth/linkedin/callback
```

## Step 4: Run Database Migration

Run the LinkedIn OAuth migration to add the necessary database columns:

```bash
# Connect to your PostgreSQL database
psql -h localhost -U postgres -d ats_tracker

# Run the migration
\i db/migrations/add_linkedin_oauth.sql
```

Or if you have a migration script:

```bash
cd backend
npm run migrate:linkedin
```

## Step 5: Test the Integration

1. Start your backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start your frontend:

   ```bash
   cd frontend/ats-tracker
   npm run dev
   ```

3. Navigate to the login page and click "Continue with LinkedIn"
4. You should be redirected to LinkedIn for authentication
5. After successful authentication, you'll be redirected back to your dashboard

## Step 6: Production Deployment

### Environment Variables

Make sure to set these environment variables in your production environment:

```env
LINKEDIN_CLIENT_ID=your_production_client_id
LINKEDIN_CLIENT_SECRET=your_production_client_secret
LINKEDIN_CALLBACK_URL=https://yourdomain.com/api/v1/users/auth/linkedin/callback
```

### LinkedIn App Configuration

1. Update your LinkedIn app's redirect URLs to include your production domain
2. Ensure your app is approved for production use (if required)

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**

   - Ensure the callback URL in your `.env` matches exactly what's configured in LinkedIn
   - Check for trailing slashes and protocol (http vs https)

2. **"App not approved"**

   - Some LinkedIn apps require approval for production use
   - Check your app status in the LinkedIn Developer Portal

3. **"Insufficient permissions"**

   - Ensure you've requested the correct scopes in your LinkedIn app
   - The app requests `r_emailaddress` and `r_liteprofile` by default

4. **Database errors**
   - Ensure you've run the migration script
   - Check that the `linkedin_id` column exists in the `users` table

### Debug Mode

To enable debug logging, add this to your `.env`:

```env
DEBUG=passport:*
```

This will show detailed OAuth flow information in your server logs.

## Security Considerations

1. **Never commit your `.env` file** - Use environment variables in production
2. **Use HTTPS in production** - LinkedIn requires HTTPS for production apps
3. **Regularly rotate secrets** - Update your LinkedIn app secrets periodically
4. **Monitor usage** - Keep an eye on your LinkedIn API usage limits

## API Limits

LinkedIn has rate limits for their API:

- **Sign In with LinkedIn**: 500 requests per day per app
- **Profile API**: 500 requests per day per app

Monitor your usage in the LinkedIn Developer Portal.

## Support

- [LinkedIn Developer Documentation](https://docs.microsoft.com/en-us/linkedin/)
- [LinkedIn OAuth 2.0 Guide](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow)
- [LinkedIn Developer Community](https://www.linkedin.com/groups/46670/)

## Next Steps

After successful LinkedIn OAuth integration:

1. Consider adding profile data sync from LinkedIn
2. Implement account linking (allow users to link multiple OAuth providers)
3. Add LinkedIn sharing features for job applications
4. Implement LinkedIn profile import for resume data
