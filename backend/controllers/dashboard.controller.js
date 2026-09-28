const User = require('../models/User.model');
const Blog = require('../models/Blog.model');
const Donation = require('../models/Donation.model');
const Contact = require('../models/Contact.model');
const Event = require('../models/Event.model');
const { ApiResponse } = require('../utils/apiResponse');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments({ status: 'published' });
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingContacts = await Contact.countDocuments({ status: 'new' });
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });

    const stats = {
      totalUsers,
      totalBlogs,
      totalDonations: totalDonations[0]?.total || 0,
      pendingContacts,
      upcomingEvents,
    };

    return ApiResponse.success(res, stats);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentDonations = await Donation.find().sort({ createdAt: -1 }).limit(5);
    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

    return ApiResponse.success(res, { recentUsers, recentDonations, recentContacts });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getChartData = async (req, res) => {
  try {
    const monthlyDonations = await Donation.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return ApiResponse.success(res, { monthlyDonations });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getTopDonors = async (req, res) => {
  try {
    const topDonors = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$email', name: { $first: '$fullName' }, total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 10 }
    ]);

    return ApiResponse.success(res, topDonors);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getPopularBlogs = async (req, res) => {
  try {
    const popularBlogs = await Blog.find({ status: 'published' })
      .sort({ views: -1 })
      .limit(5)
      .select('title views likes');

    return ApiResponse.success(res, popularBlogs);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const upcomingEvents = await Event.find({ status: 'upcoming' })
      .sort({ date: 1 })
      .limit(5);

    return ApiResponse.success(res, upcomingEvents);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getChartData,
  getTopDonors,
  getPopularBlogs,
  getUpcomingEvents,
};