import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userService from '../services/userService.js';
import oauthService from '../services/oauthService.js';

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.u_id || user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// ============================================
// GOOGLE OAUTH STRATEGY
// ============================================
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/api/v1/auth/google/callback',
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('📧 Google OAuth callback received for:', profile.emails[0].value);
          
          const result = await oauthService.handleOAuthLogin({
            provider: 'google',
            providerId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
            firstName: profile.name?.givenName || '',
            lastName: profile.name?.familyName || '',
            profilePicture: profile.photos?.[0]?.value || null,
            accessToken,
            refreshToken,
            profileData: profile._json,
          });

          console.log('✅ OAuth login successful for:', result.user.email);
          done(null, result.user);
        } catch (error) {
          console.error('❌ Error in Google OAuth callback:', error);
          done(error, null);
        }
      }
    )
  );
  console.log('✅ Google OAuth Strategy configured');
} else {
  console.warn('⚠️  Google OAuth credentials not found in environment variables');
}

export default passport;

