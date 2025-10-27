import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userService from "../services/userService.js";

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
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

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || "/api/v1/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract email from Google profile
        const email = profile.emails[0].value;
        const googleId = profile.id;

        // First check if user exists with this Google ID
        let user = await userService.getUserByGoogleId(googleId);

        if (user) {
          // User exists with this Google ID
          return done(null, { id: user.u_id, email: user.email });
        }

        // Check if user exists with this email
        user = await userService.getUserByEmail(email);

        if (user) {
          // User exists but doesn't have Google ID linked
          if (!user.google_id) {
            // Link Google account to existing user
            await userService.linkGoogleAccount(user.u_id, googleId);
          }
          return done(null, { id: user.u_id, email: user.email });
        }

        // Create new user from Google OAuth
        const newUser = await userService.createOAuthUser({
          email,
          googleId,
        });

        return done(null, { id: newUser.id, email: newUser.email });
      } catch (error) {
        console.error("❌ OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;
