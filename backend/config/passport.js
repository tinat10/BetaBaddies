import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
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

// Google OAuth Strategy (only register if credentials are available)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          "/api/v1/users/auth/google/callback",
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
} else {
  console.log(
    "⚠️  Google OAuth credentials not found. Google login will be disabled."
  );
}

// LinkedIn OAuth Strategy (only register if credentials are available)
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL:
          process.env.LINKEDIN_CALLBACK_URL ||
          "/api/v1/users/auth/linkedin/callback",
        scope: ["r_emailaddress", "r_liteprofile"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract email from LinkedIn profile
          const email = profile.emails[0].value;
          const linkedinId = profile.id;

          // First check if user exists with this LinkedIn ID
          let user = await userService.getUserByLinkedInId(linkedinId);

          if (user) {
            // User exists with this LinkedIn ID
            return done(null, { id: user.u_id, email: user.email });
          }

          // Check if user exists with this email
          user = await userService.getUserByEmail(email);

          if (user) {
            // User exists but doesn't have LinkedIn ID linked
            if (!user.linkedin_id) {
              // Link LinkedIn account to existing user
              await userService.linkLinkedInAccount(user.u_id, linkedinId);
            }
            return done(null, { id: user.u_id, email: user.email });
          }

          // Create new user from LinkedIn OAuth
          const newUser = await userService.createLinkedInOAuthUser({
            email,
            linkedinId,
          });

          return done(null, { id: newUser.id, email: newUser.email });
        } catch (error) {
          console.error("❌ LinkedIn OAuth error:", error);
          return done(error, null);
        }
      }
    )
  );
  console.log("✅ LinkedIn OAuth strategy registered successfully");
} else {
  console.log(
    "⚠️  LinkedIn OAuth credentials not found. LinkedIn login will be disabled."
  );
  console.log("   To enable LinkedIn OAuth, add these to your .env file:");
  console.log("   LINKEDIN_CLIENT_ID=your_linkedin_client_id");
  console.log("   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret");
  console.log(
    "   LINKEDIN_CALLBACK_URL=http://localhost:3001/api/v1/users/auth/linkedin/callback"
  );
}

export default passport;
