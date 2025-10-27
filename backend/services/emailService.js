/**
 * Email Service for sending notifications
 * For development: Logs to console instead of sending actual emails
 * For production: Configure SMTP settings and use nodemailer
 */

class EmailService {
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

    // Production mode - use nodemailer (configure when needed)
    /*
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

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
      await transporter.sendMail(mailOptions);
      console.log('Account deletion email sent to:', email);
    } catch (error) {
      console.error('Error sending deletion email:', error);
      // Don't throw - deletion still successful even if email fails
    }
    */
  }
}

export default new EmailService();

