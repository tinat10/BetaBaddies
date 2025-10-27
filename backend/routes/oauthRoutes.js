import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

// ============================================
// GOOGLE OAUTH
// ============================================

// Initiate Google OAuth
// Route: GET /api/v1/auth/google
router.get(
  '/google',
  (req, res, next) => {
    console.log('🚀 Initiating Google OAuth flow...');
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
    prompt: 'consent',
  })
);

// Google OAuth callback
// Route: GET /api/v1/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`,
    session: true,
  }),
  (req, res) => {
    try {
      console.log('✅ Google OAuth callback successful');
      
      // Set session
      req.session.userId = req.user.u_id;
      req.session.userEmail = req.user.email;

      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error('❌ Error saving session:', err);
          return res.redirect(`${process.env.FRONTEND_URL}/login?error=session_failed`);
        }

        console.log('✅ Session saved, redirecting to dashboard');
        // Redirect to frontend dashboard
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?oauth=success&provider=google`);
      });
    } catch (error) {
      console.error('❌ Error in OAuth callback handler:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`);
    }
  }
);

// ============================================
// LINKEDIN OAUTH (Ready for future implementation)
// ============================================

// Uncomment when LinkedIn is configured
/*
router.get(
  '/linkedin',
  passport.authenticate('linkedin', {
    state: true,
  })
);

router.get(
  '/linkedin/callback',
  passport.authenticate('linkedin', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
  }),
  (req, res) => {
    req.session.userId = req.user.u_id;
    req.session.userEmail = req.user.email;
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?oauth=success&provider=linkedin`);
  }
);
*/

// ============================================
// GITHUB OAUTH (Ready for future implementation)
// ============================================

// Uncomment when GitHub is configured
/*
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
  })
);

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed`,
  }),
  (req, res) => {
    req.session.userId = req.user.u_id;
    req.session.userEmail = req.user.email;
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?oauth=success&provider=github`);
  }
);
*/

// OAuth status endpoint (for debugging)
router.get('/status', (req, res) => {
  res.json({
    ok: true,
    data: {
      googleConfigured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      linkedinConfigured: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
      githubConfigured: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  });
});

export default router;

