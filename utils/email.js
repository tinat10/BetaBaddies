const nodemailer = require('nodemailer');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

async function sendResetEmail(toEmail, token) {
  const resetLink = `${FRONTEND_URL}/reset-password.html?token=${token}`;
  // If SMTP is configured via env, try to send; otherwise log the link.
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST;

  if (smtpUser && smtpPass && smtpHost) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass }
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        to: toEmail,
        subject: 'Password reset instructions',
        text: `Click to reset your password: ${resetLink}`,
        html: `<p>Click to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
      });

      console.log(`Reset email sent to ${toEmail}`);
      return;
    } catch (err) {
      console.error('Error sending email, falling back to console log', err);
    }
  }

  // fallback: print link to console for development
  console.log(`Reset link for ${toEmail}: ${resetLink}`);
}

module.exports = { sendResetEmail };
