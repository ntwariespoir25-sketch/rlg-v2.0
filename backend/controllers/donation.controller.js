const Donation = require('../models/Donation.model');
const { sendDonationReceipt, sendEmail } = require('../utils/sendEmail');
const { ApiResponse } = require('../utils/apiResponse');
const crypto = require('crypto');

const createDonation = async (req, res) => {
  try {
    const donation = await Donation.create(req.body);

    // Notify RLG team via email
    try {
      await sendEmail({
        email: process.env.EMAIL_USER || 'raisingleaderofgeneration@gmail.com',
        subject: `New Donation Initiated: ${donation.currency} ${donation.amount}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #166534;">New Donation Initiated</h2>
            <div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
              <p><strong>Name:</strong> ${donation.fullName}</p>
              <p><strong>Email:</strong> ${donation.email}</p>
              <p><strong>Phone:</strong> ${donation.phone || 'N/A'}</p>
              <p><strong>Amount:</strong> ${donation.currency} ${donation.amount}</p>
              <p><strong>Payment Method:</strong> ${donation.paymentMethod}</p>
              <p><strong>Monthly:</strong> ${donation.isMonthly ? 'Yes' : 'No'}</p>
            </div>
            <p>Manage donations from the admin panel: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/donations">RLG Admin</a></p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log('Donation notification email failed:', emailError.message);
    }

    return ApiResponse.created(res, donation, 'Donation initiated');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    return ApiResponse.success(res, donations);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return ApiResponse.notFound(res, 'Donation not found');
    return ApiResponse.success(res, donation);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return ApiResponse.notFound(res, 'Donation not found');
    
    donation.status = req.body.status;
    if (req.body.status === 'completed') {
      donation.transactionId = crypto.randomBytes(16).toString('hex');
      await sendDonationReceipt(donation.email, donation.fullName, donation.amount, donation.transactionId);
    }
    await donation.save();
    
    return ApiResponse.success(res, donation, 'Status updated');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return ApiResponse.notFound(res, 'Donation not found');
    await donation.deleteOne();
    return ApiResponse.success(res, null, 'Donation deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getDonationStats = async (req, res) => {
  try {
    const total = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    const monthly = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$amount' } } }
    ]);
    return ApiResponse.success(res, { total: total[0] || { total: 0, count: 0 }, monthly });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const processMobileMoneyPayment = async (req, res) => {
  try {
    // This would integrate with MTN/Airtel API
    // For now, simulate payment
    const { phoneNumber, amount } = req.body;
    return ApiResponse.success(res, { message: 'Payment processing', reference: crypto.randomBytes(8).toString('hex') });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getDonationReceipt = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return ApiResponse.notFound(res, 'Donation not found');
    return ApiResponse.success(res, donation);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  createDonation,
  getAllDonations,
  getDonationById,
  updateDonationStatus,
  deleteDonation,
  getDonationStats,
  processMobileMoneyPayment,
  getDonationReceipt,
};