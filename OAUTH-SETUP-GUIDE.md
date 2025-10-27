# 🎉 Google OAuth Implementation - Setup Guide

## ✅ What's Been Done

All code has been implemented! Here's what's ready:

### Backend (Complete ✅)
- ✅ Database migration created (`db/oauth_migration.sql`)
- ✅ Passport.js dependencies installed
- ✅ Passport configuration (`backend/config/passport.js`)
- ✅ OAuth service (`backend/services/oauthService.js`)
- ✅ OAuth routes (`backend/routes/oauthRoutes.js`)
- ✅ Server.js updated with Passport middleware
- ✅ `.env.example` file created

### Frontend (Complete ✅)
- ✅ OAuthButton component (`frontend/ats-tracker/src/components/OAuthButton.tsx`)
- ✅ Login page updated with Google OAuth button
- ✅ Register page updated with Google OAuth button

---

## 🚀 Setup Steps (Required)

### Step 1: Create `.env` File

**Location:** `backend/.env`

Create this file and add your Google OAuth credentials:

```env
# Database Configuration
DB_USER=ats_user
DB_HOST=localhost
DB_NAME=ats_tracker
DB_PASS=ats_password
DB_PORT=5432

# Server Configuration
PORT=3001
NODE_ENV=development

# Session Configuration
SESSION_SECRET=your-secret-key-change-in-production-please-make-this-random-and-secure

# Frontend URL (for CORS and OAuth redirects)
FRONTEND_URL=http://localhost:5173

# OAuth - Google
GOOGLE_CLIENT_ID=324178283347-g42a28kibpcigrnfu3gfk0jllqu2gcfb.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE  ← REPLACE THIS!
GOOGLE_CALLBACK_URL=http://localhost:3001/api/v1/auth/google/callback
```

**⚠️ IMPORTANT:** Replace `YOUR_GOOGLE_CLIENT_SECRET_HERE` with your actual Google Client Secret from Google Cloud Console!

---

### Step 2: Run Database Migration

The migration will:
- Create `oauth_accounts` table
- Update `users` table (add oauth fields, make password nullable)
- Update `profiles` table (add linkedin_url, github_url, import tracking)

**Run this command:**

```bash
psql -U ats_user -d ats_tracker -f db/oauth_migration.sql
```

Or manually connect to your database and run the migration script.

**Verify migration:**
```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('oauth_accounts', 'users', 'profiles') 
ORDER BY table_name;

-- Check oauth_accounts structure
\d oauth_accounts
```

---

### Step 3: Restart Backend Server

If your backend is running, restart it to load the new environment variables:

```bash
cd backend
npm start
```

You should see:
```
✅ Google OAuth Strategy configured
```

If you see:
```
⚠️  Google OAuth credentials not found in environment variables
```
Then your `.env` file is not loaded correctly or the CLIENT_SECRET is missing.

---

### Step 4: Test OAuth Flow

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend/ats-tracker
   npm run dev
   ```

2. **Open browser:**
   - Go to: `http://localhost:5173/login`
   - You should see a "Continue with Google" button

3. **Click "Continue with Google":**
   - Should redirect to Google consent screen
   - Approve permissions
   - Should redirect back to `http://localhost:5173/dashboard?oauth=success&provider=google`
   - Should be logged in!

4. **Check backend logs:**
   ```
   🚀 Initiating Google OAuth flow...
   📧 Google OAuth callback received for: your-email@gmail.com
   🔐 Processing OAuth login for your-email@gmail.com via google
   📝 Creating new user from OAuth
   📥 Importing profile data from google...
   ✅ New profile created from OAuth data
   ✅ Profile picture set from OAuth
   ✅ OAuth login successful for: your-email@gmail.com
   ✅ Google OAuth callback successful
   ✅ Session saved, redirecting to dashboard
   ```

5. **Check database:**
   ```sql
   -- Check user was created
   SELECT u_id, email, oauth_provider FROM users WHERE oauth_provider = 'google';
   
   -- Check OAuth account was created
   SELECT * FROM oauth_accounts WHERE provider = 'google';
   
   -- Check profile was created with imported data
   SELECT user_id, first_name, last_name, profile_imported_from 
   FROM profiles 
   WHERE profile_imported_from = 'google';
   ```

---

## 🔍 Troubleshooting

### Issue: "Redirect URI mismatch" error

**Solution:** Check Google Cloud Console settings:
- Go to: https://console.cloud.google.com/
- Navigate to: APIs & Services > Credentials
- Edit your OAuth 2.0 Client ID
- Verify Authorized redirect URIs includes:
  ```
  http://localhost:3001/api/v1/auth/google/callback
  ```

### Issue: "Google OAuth credentials not found"

**Solution:** 
1. Make sure `.env` file exists in `backend/` directory
2. Make sure `GOOGLE_CLIENT_SECRET` is set (not empty)
3. Restart the backend server

### Issue: CORS error when clicking OAuth button

**Solution:** Check `FRONTEND_URL` in `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

### Issue: OAuth success but not logged in

**Solution:** 
- Check session configuration in `backend/server.js`
- Make sure cookies are enabled in browser
- Check browser console for errors
- Try clearing cookies and trying again

### Issue: Profile data not imported

**Solution:**
- Check backend logs for "Importing profile data" message
- Verify profiles table has required columns
- The default state is set to 'NJ' - user can update later

---

## 📊 What Happens During OAuth Flow

### 1. User clicks "Continue with Google"
```javascript
// Frontend button redirects to:
window.location.href = 'http://localhost:3001/api/v1/auth/google'
```

### 2. Backend initiates OAuth
```javascript
// Passport redirects to Google consent screen
passport.authenticate('google', {
  scope: ['profile', 'email']
})
```

### 3. User approves on Google

### 4. Google redirects back to callback
```
GET http://localhost:3001/api/v1/auth/google/callback?code=...
```

### 5. Backend processes OAuth callback
- Exchanges code for access token
- Fetches user profile from Google
- Checks if user exists in database
  - If yes: Links OAuth account
  - If no: Creates new user
- Imports profile data (name, email, picture)
- Creates session
- Redirects to frontend dashboard

### 6. User is logged in! ✅

---

## 🔐 Security Notes

### Production Checklist
- [ ] Use HTTPS for all OAuth redirects
- [ ] Update callback URL in Google Console to production URL
- [ ] Encrypt OAuth tokens in database
- [ ] Use strong SESSION_SECRET
- [ ] Set secure: true for cookies in production
- [ ] Enable CSRF protection
- [ ] Rate limit OAuth endpoints
- [ ] Add refresh token logic for expired tokens

### Current Security Features
- ✅ Session-based authentication
- ✅ httpOnly cookies
- ✅ CORS configuration
- ✅ Rate limiting (global)
- ✅ Password not required for OAuth users
- ✅ Profile data validated before import
- ✅ Tokens stored securely (but not encrypted yet)

---

## 🎯 Testing Checklist

### First Time User (New Account)
- [ ] Click "Continue with Google"
- [ ] Approve Google permissions
- [ ] Redirected to dashboard
- [ ] Profile shows Google name
- [ ] Profile picture shows Google photo
- [ ] Can logout and login again with Google

### Existing User (Link OAuth)
- [ ] Register with email/password
- [ ] Logout
- [ ] Login with Google using same email
- [ ] Should link to existing account (not create duplicate)
- [ ] Can now login with either method

### Edge Cases
- [ ] User denies Google permissions → redirects to login with error
- [ ] User with no email on Google → error handled gracefully
- [ ] OAuth twice with same account → updates tokens, doesn't duplicate

---

## 📈 Next Steps (Optional)

### Add More OAuth Providers

1. **LinkedIn** (Professional data):
   ```bash
   npm install passport-linkedin-oauth2
   ```
   - Get credentials: https://www.linkedin.com/developers/apps
   - Uncomment LinkedIn routes in `oauthRoutes.js`
   - Add strategy to `passport.js`

2. **GitHub** (Developer profiles):
   ```bash
   npm install passport-github2
   ```
   - Get credentials: https://github.com/settings/developers
   - Uncomment GitHub routes in `oauthRoutes.js`
   - Add strategy to `passport.js`

### Enhance OAuth Features
- [ ] Add "Disconnect Google" button in Settings
- [ ] Show which OAuth providers are linked
- [ ] Allow multiple OAuth accounts per user
- [ ] Add OAuth token refresh logic
- [ ] Import more profile data (location, headline, etc.)
- [ ] Sync profile updates from OAuth provider

---

## 📁 Files Created/Modified

### Backend Files
```
backend/
├── config/
│   └── passport.js                    ← NEW
├── services/
│   └── oauthService.js               ← NEW
├── routes/
│   └── oauthRoutes.js                ← NEW
├── server.js                          ← MODIFIED
├── .env                               ← YOU NEED TO CREATE THIS
└── .env.example                       ← NEW

db/
└── oauth_migration.sql                ← NEW
```

### Frontend Files
```
frontend/ats-tracker/src/
├── components/
│   └── OAuthButton.tsx                ← NEW
├── pages/
│   ├── Login.tsx                      ← MODIFIED
│   └── Register.tsx                   ← MODIFIED
```

---

## ✅ Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Database Migration | ✅ Created | Run manually |
| Backend Dependencies | ✅ Installed | passport, passport-google-oauth20 |
| Passport Config | ✅ Complete | Google strategy configured |
| OAuth Service | ✅ Complete | Account creation, linking, profile import |
| OAuth Routes | ✅ Complete | /auth/google, /auth/google/callback |
| Server Integration | ✅ Complete | Passport middleware added |
| Frontend Button | ✅ Complete | Reusable OAuthButton component |
| Login Page | ✅ Complete | Google OAuth button added |
| Register Page | ✅ Complete | Google OAuth button added |
| .env Configuration | ⚠️ Manual | You need to create .env file |
| Database Migration | ⚠️ Manual | You need to run migration |
| Testing | ⏳ Pending | Ready for you to test! |

---

## 🎉 You're Almost Done!

**Just 2 more steps:**

1. **Create `.env` file** with your Google Client Secret
2. **Run database migration**

Then test it out! 🚀

**Questions?** Check the troubleshooting section above or let me know!

---

## 📞 Support

If you encounter any issues:
1. Check backend console logs
2. Check browser console (F12)
3. Verify .env configuration
4. Verify Google Cloud Console settings
5. Check database migration ran successfully

**Common Issues:**
- "Redirect URI mismatch" → Check Google Console settings
- "CORS error" → Check FRONTEND_URL in .env
- "Not logged in after OAuth" → Check session configuration
- "Profile not imported" → Check backend logs for errors

Good luck! 🎊

