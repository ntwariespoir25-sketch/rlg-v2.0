const GetInvolved = require('../models/GetInvolved.model');
const { sendEmail } = require('../utils/sendEmail');
const { ApiResponse } = require('../utils/apiResponse');

// @desc    Submit get involved form
// @route   POST /api/getinvolved
// @access  Public
const submitGetInvolved = async (req, res) => {
  try {
    const { fullName, email, phone, organization, interest, district, message } = req.body;
    
    // Create submission
    const submission = await GetInvolved.create({
      fullName,
      email,
      phone,
      organization,
      interest,
      district,
      message,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Notify RLG team via email
    try {
      await sendEmail({
        email: process.env.EMAIL_USER || 'raisingleaderofgeneration@gmail.com',
        subject: `New Get Involved Application: ${interest}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #166534;">New Get Involved Application</h2>
            <div style="background: #f0fdf4; padding: 15px; border-left: 4px solid #16a34a; margin: 15px 0;">
              <p><strong>Full Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
              <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
              <p><strong>Interest:</strong> ${interest}</p>
              <p><strong>District:</strong> ${district || 'N/A'}</p>
              <p><strong>Message:</strong><br/>${message || 'N/A'}</p>
            </div>
            <p>Review applications from the admin panel: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/getinvolved">RLG Admin</a></p>
          </div>
        `,
      });
    } catch (emailError) {
      console.log('Get Involved notification email failed:', emailError.message);
    }
    
    return ApiResponse.created(res, submission, 'Application submitted successfully! A coordinator will contact you soon.');
  } catch (error) {
    console.error('Get Involved submission error:', error);
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get all get involved submissions
// @route   GET /api/getinvolved
// @access  Private/Admin
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await GetInvolved.find().sort({ createdAt: -1 });
    return ApiResponse.success(res, submissions);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get single submission
// @route   GET /api/getinvolved/:id
// @access  Private/Admin
const getSubmissionById = async (req, res) => {
  try {
    const submission = await GetInvolved.findById(req.params.id);
    if (!submission) {
      return ApiResponse.notFound(res, 'Submission not found');
    }
    return ApiResponse.success(res, submission);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Update submission status
// @route   PATCH /api/getinvolved/:id/status
// @access  Private/Admin
const updateSubmissionStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const submission = await GetInvolved.findById(req.params.id);
    
    if (!submission) {
      return ApiResponse.notFound(res, 'Submission not found');
    }
    
    submission.status = status;
    if (notes) submission.notes = notes;
    if (status === 'contacted') {
      submission.contactedBy = req.admin._id;
      submission.contactedAt = new Date();
    }
    
    await submission.save();
    
    return ApiResponse.success(res, submission, 'Status updated successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Delete submission
// @route   DELETE /api/getinvolved/:id
// @access  Private/Admin
const deleteSubmission = async (req, res) => {
  try {
    const submission = await GetInvolved.findById(req.params.id);
    if (!submission) {
      return ApiResponse.notFound(res, 'Submission not found');
    }
    
    await submission.deleteOne();
    return ApiResponse.success(res, null, 'Submission deleted successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get submission stats
// @route   GET /api/getinvolved/stats
// @access  Private/Admin
const getSubmissionStats = async (req, res) => {
  try {
    const stats = await GetInvolved.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const interestStats = await GetInvolved.aggregate([
      { $group: { _id: '$interest', count: { $sum: 1 } } }
    ]);
    
    return ApiResponse.success(res, { stats, interestStats });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  submitGetInvolved,
  getAllSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  deleteSubmission,
  getSubmissionStats,
};