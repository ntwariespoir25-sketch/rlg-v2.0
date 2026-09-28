const nodemailer = require('nodemailer');

let transporter = null;

try {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} catch (error) {
  console.log('Email transporter not configured');
}

const sendEmail = async (options) => {
  if (!transporter) {
    console.log('Email not sent - transporter not configured');
    return { messageId: 'simulated' };
  }
  
  try {
    const mailOptions = {
      from: `"RLG Rwanda" <${process.env.EMAIL_FROM || 'noreply@rlg.org'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return null;
  }
};

const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">Welcome to RLG, ${name}!</h2>
      <p>Thank you for joining the Rising Leaders of Generation community.</p>
      <p>We're excited to have you on board. Together, we'll build the next generation of leaders.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visit our website</a>
      <p style="margin-top: 20px;">Best regards,<br>RLG Team</p>
    </div>
  `;
  
  return sendEmail({ email, subject: 'Welcome to RLG!', html });
};

const sendContactReply = async (email, name, reply, originalMessage) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">Response from RLG Team</h2>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to us. Here's our response to your inquiry:</p>
      <div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #22c55e; margin: 15px 0;">
        <p><strong>Our reply:</strong> ${reply}</p>
      </div>
      <p>Best regards,<br>RLG Team</p>
    </div>
  `;
  
  return sendEmail({ email, subject: 'Response from RLG', html });
};

const sendDonationReceipt = async (email, name, amount, transactionId) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">Donation Receipt</h2>
      <p>Dear ${name},</p>
      <p>Thank you for your generous donation of <strong>${amount}</strong> to RLG.</p>
      <p><strong>Transaction ID:</strong> ${transactionId}</p>
      <p>Your support helps us empower young leaders across Rwanda.</p>
      <p>Best regards,<br>RLG Team</p>
    </div>
  `;
  
  return sendEmail({ email, subject: 'Your RLG Donation Receipt', html });
};

module.exports = { sendEmail, sendWelcomeEmail, sendContactReply, sendDonationReceipt };