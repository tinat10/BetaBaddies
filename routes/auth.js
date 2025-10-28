const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sendResetEmail } = require('../utils/email');

module.exports = ({ pool }) => {
  const router = express.Router();

  // POST /auth/reset-request
  router.post('/auth/reset-request', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    try {
      const client = await pool.connect();
      try {
        const { rows } = await client.query('SELECT u_id FROM public.users WHERE email = $1', [email.toLowerCase()]);
        // Always respond success to avoid leaking whether email exists
        res.json({ success: true, message: 'If that email is registered, you will receive reset instructions.' });

        if (rows.length === 0) {
          // not registered: do nothing else
          return;
        }

        const userId = rows[0].u_id;
        const token = crypto.randomBytes(24).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        await client.query(
          'UPDATE public.users SET reset_token = $1, reset_token_expires = $2 WHERE u_id = $3',
          [token, expires.toISOString(), userId]
        );

        // send reset email (may log link if mailer not configured)
        await sendResetEmail(email, token);
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('reset-request error', err);
      // still do not leak info; returning success already sent above
    }
  });

  // POST /auth/reset/:token
  router.post('/auth/reset/:token', async (req, res) => {
    const token = req.params.token;
    const { password, confirm } = req.body;

    if (!password || !confirm) return res.status(400).json({ success: false, message: 'Password and confirm required' });
    if (password !== confirm) return res.status(400).json({ success: false, message: 'Passwords do not match' });
    if (password.length < 8) return res.status(400).json({ success: false, message: 'Password too short (min 8 chars)' });

    try {
      const client = await pool.connect();
      try {
        const now = new Date();
        const { rows } = await client.query(
          'SELECT u_id FROM public.users WHERE reset_token = $1 AND reset_token_expires IS NOT NULL AND reset_token_expires > $2',
          [token, now.toISOString()]
        );

        if (rows.length === 0) {
          return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        const userId = rows[0].u_id;
        const hashed = await bcrypt.hash(password, 12);

        await client.query(
          'UPDATE public.users SET password = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW() WHERE u_id = $2',
          [hashed, userId]
        );

        return res.json({ success: true, message: 'Password updated' });
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('reset error', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  return router;
};
