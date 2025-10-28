/**
 * Email Service for sending notifications
 * Development: Logs to console
 * Production: Uses nodemailer with SMTP
 */

import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    // Only initialize in production
    if (process.env.NODE_ENV === 'production') {
      try {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: true, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          },
          tls: {
            rejectUnauthorized: false // For self-signed certificates
          }
        });

        // Verify connection configuration
        await this.transporter.verify();
        console.log('✅ Email service initialized successfully');
      } catch (error) {
        console.error('❌ Email service initialization failed:', error);
        this.transporter = null;
      }
    }
  }

  /**
   * Send account deletion confirmation email
   * @param {string} email - User's email address
   * @returns {Promise<void>}
   */
  async sendAccountDeletionConfirmation(email) {
    // Development mode - log to console
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n========== ACCOUNT DELETION EMAIL ==========');
      console.log(`To: ${email}`);
      console.log('Subject: Account Deletion Confirmation - ATS Tracker');
      console.log('\nYour ATS Tracker account has been permanently deleted.');
      console.log('All your personal data has been removed from our systems.');
      console.log('\nIf you did not request this deletion, please contact support immediately.');
      console.log('\nThank you for using ATS Tracker.');
      console.log('============================================\n');
      return;
    }

    // Production mode - use nodemailer
    if (!this.transporter) {
      console.error('❌ Email service not initialized');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@atstracker.com',
      to: email,
      subject: 'Account Deletion Confirmation - ATS Tracker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC2626;">Your Account Has Been Deleted</h2>
          <p>This email confirms that your ATS Tracker account has been permanently deleted.</p>
          <p>All your personal data, including:</p>
          <ul>
            <li>Profile information</li>
            <li>Employment history</li>
            <li>Education records</li>
            <li>Skills and certifications</li>
            <li>Projects</li>
          </ul>
          <p>...has been removed from our systems.</p>
          <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #DC2626; font-weight: bold;">
            If you did not request this deletion, please contact our support team immediately.
          </p>
          <p style="color: #6B7280; font-size: 12px;">
            Thank you for using ATS Tracker.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Account deletion email sent to:', email);
    } catch (error) {
      console.error('❌ Error sending deletion email:', error);
      // Don't throw - deletion still successful even if email fails
    }
  }

  /**
   * Send password reset email
   * @param {string} email - User's email address
   * @param {string} resetToken - Password reset token
   * @returns {Promise<void>}
   */
  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    // Development mode - log to console
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n========== PASSWORD RESET EMAIL ==========');
      console.log(`To: ${email}`);
      console.log('Subject: Password Reset Request - ATS Tracker');
      console.log('\nYou requested a password reset for your ATS Tracker account.');
      console.log('\nClick the link below to reset your password:');
      console.log(resetUrl);
      console.log('\nThis link will expire in 1 hour for security reasons.');
      console.log('\nIf you did not request this password reset, please ignore this email.');
      console.log('\nThank you for using ATS Tracker.');
      console.log('==========================================\n');
      return;
    }

    // Production mode - use nodemailer
    if (!this.transporter) {
      console.error('❌ Email service not initialized');
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@atstracker.com',
      to: email,
      subject: 'Password Reset Request - ATS Tracker',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6A94EE;">Password Reset Request</h2>
          <p>You requested a password reset for your ATS Tracker account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(to right, #6A94EE, #916BE3); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #6B7280; font-size: 14px;">
            This link will expire in 1 hour for security reasons.
          </p>
          <p style="color: #6B7280; font-size: 14px;">
            If you did not request this password reset, please ignore this email.
          </p>
          <hr style="border: 1px solid #E5E7EB; margin: 20px 0;">
          <p style="color: #6B7280; font-size: 12px;">
            Thank you for using ATS Tracker.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent to:', email);
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      throw error;
    }
  }
}

export default new EmailService();