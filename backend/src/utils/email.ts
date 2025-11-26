import sgMail from '@sendgrid/mail';

// Set API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationToken: string
) => {
  console.log('🔄 Sending verification email to:', email);
  
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const msg = {
    to: email,
    from: {
      email: process.env.EMAIL_USER!,
      name: 'Illini Lost & Found'
    },
    subject: 'Verify Your Illini Lost & Found Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #13294B; color: white; padding: 20px; text-align: center;">
          <h1>🎓 Illini Lost & Found</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Hi ${name},</h2>
          <p>Thank you for registering with Illini Lost & Found!</p>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #E84A27; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link:</p>
          <p style="color: #E84A27; word-break: break-all; background: white; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
          <p><strong>⏰ This link will expire in 24 hours.</strong></p>
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
          <p><strong>University of Illinois Urbana-Champaign</strong></p>
          <p>Illini Lost & Found - CS409 Project</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Verification email sent to:', email);
  } catch (error: any) {
    console.error('❌ Email sending failed:', error.response?.body || error);
    throw new Error('Failed to send verification email');
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  console.log('🎉 Sending welcome email to:', email);

  const msg = {
    to: email,
    from: {
      email: process.env.EMAIL_USER!,
      name: 'Illini Lost & Found'
    },
    subject: '🎉 Welcome to Illini Lost & Found!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #13294B; color: white; padding: 20px; text-align: center;">
          <h1>🎓 Welcome!</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Hi ${name},</h2>
          <p>Your email has been verified successfully! 🎉</p>
          <p><a href="${process.env.FRONTEND_URL}/login" style="color: #E84A27; font-weight: bold;">Click here to login</a></p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Welcome email sent');
  } catch (error: any) {
    console.error('❌ Welcome email failed:', error.response?.body || error);
  }
};