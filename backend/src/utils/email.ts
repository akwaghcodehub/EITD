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
export const sendClaimApprovedEmail = async (
  email: string,
  name: string,
  itemTitle: string,
  itemId: string
) => {
  console.log('📧 Sending claim approved email to:', email);

  const itemUrl = `${process.env.FRONTEND_URL}/items/${itemId}`;

  const msg = {
    to: email,
    from: {
      email: process.env.EMAIL_USER!,
      name: 'Illini Lost & Found'
    },
    subject: '✅ Your Claim Has Been Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #13294B; color: white; padding: 20px; text-align: center;">
          <h1>🎓 Claim Approved!</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Hi ${name},</h2>
          
          <div style="background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #22c55e; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; color: #22c55e; font-weight: bold;">
              ✅ Great news! Your claim has been approved.
            </p>
          </div>

          <p><strong>Item:</strong> ${itemTitle}</p>
          
          <p>An administrator has reviewed your claim and approved it. You can now proceed to collect your item.</p>
          
          <h3 style="color: #13294B; margin-top: 30px;">Next Steps:</h3>
          <ol style="line-height: 2;">
            <li>Contact the person who found your item using the contact information provided in the item listing</li>
            <li>Arrange a safe meeting place on campus</li>
            <li>Bring valid UIUC ID for verification</li>
          </ol>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${itemUrl}" 
               style="background-color: #E84A27; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              View Item Details
            </a>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            <strong>Important:</strong> Please collect your item within 7 days. If you have any questions, contact the finder directly.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
          <p><strong>University of Illinois Urbana-Champaign</strong></p>
          <p>Illini Lost & Found</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Claim approved email sent to:', email);
  } catch (error: any) {
    console.error('❌ Claim approved email failed:', error.response?.body || error);
  }
};

export const sendClaimRejectedEmail = async (
  email: string,
  name: string,
  itemTitle: string
) => {
  console.log('📧 Sending claim rejected email to:', email);

  const msg = {
    to: email,
    from: {
      email: process.env.EMAIL_USER!,
      name: 'Illini Lost & Found'
    },
    subject: '❌ Claim Update: Not Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #13294B; color: white; padding: 20px; text-align: center;">
          <h1>🎓 Claim Status Update</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Hi ${name},</h2>
          
          <div style="background: white; padding: 20px; border-radius: 10px; border-left: 4px solid #ef4444; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; color: #ef4444; font-weight: bold;">
              ❌ Unfortunately, your claim was not approved.
            </p>
          </div>

          <p><strong>Item:</strong> ${itemTitle}</p>
          
          <p>After reviewing the verification details you provided, the administrator has determined that additional proof of ownership is needed.</p>
          
          <h3 style="color: #13294B; margin-top: 30px;">What You Can Do:</h3>
          <ul style="line-height: 2;">
            <li>Review the item details again to ensure it matches your lost item</li>
            <li>If you believe this is your item, you can submit a new claim with more detailed verification information</li>
            <li>Consider including serial numbers, receipts, photos, or unique identifying features</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/browse" 
               style="background-color: #E84A27; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Browse Other Items
            </a>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have questions about this decision, please contact us at support@illinilostfound.com
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
          <p><strong>University of Illinois Urbana-Champaign</strong></p>
          <p>Illini Lost & Found</p>
        </div>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Claim rejected email sent to:', email);
  } catch (error: any) {
    console.error('❌ Claim rejected email failed:', error.response?.body || error);
  }
};