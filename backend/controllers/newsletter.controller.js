const Newsletter = require('../models/Newsletter.model');
const { ApiResponse } = require('../utils/apiResponse');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribe = async (req, res) => {
  try {
    const { email, source } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return ApiResponse.badRequest(res, 'Please provide a valid email address');
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        existing.unsubscribedAt = undefined;
        await existing.save();
      }
      return ApiResponse.success(res, existing, 'You are already subscribed to our newsletter');
    }

    const subscriber = await Newsletter.create({ email, source: source || 'footer' });

    try {
      await sendEmail({
        email: process.env.EMAIL_USER || 'raisingleaderofgeneration@gmail.com',
        subject: 'New Newsletter Subscriber',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #166534;">New Newsletter Subscription</h2>
            <p>A new visitor subscribed to the RLG newsletter:</p>
            <div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Source:</strong> ${source || 'footer'}</p>
            </div>
            <p>Best regards,<br>RLG System</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log('Newsletter notification email failed:', emailError.message);
    }

    return ApiResponse.created(res, subscriber, 'Subscription successful');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get all subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    return ApiResponse.success(res, subscribers);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Unsubscribe from newsletter
// @route   DELETE /api/newsletter/:id
// @access  Public
const unsubscribe = async (req, res) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    if (!subscriber) {
      return ApiResponse.notFound(res, 'Subscriber not found');
    }
    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();
    return ApiResponse.success(res, subscriber, 'Unsubscribed successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get subscriber stats
// @route   GET /api/newsletter/stats
// @access  Private/Admin
const getNewsletterStats = async (req, res) => {
  try {
    const total = await Newsletter.countDocuments();
    const active = await Newsletter.countDocuments({ isActive: true });
    return ApiResponse.success(res, { total, active });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  subscribe,
  getAllSubscribers,
  unsubscribe,
  getNewsletterStats,
};