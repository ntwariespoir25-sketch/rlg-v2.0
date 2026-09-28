const User = require('../models/User.model');
const { ApiResponse } = require('../utils/apiResponse');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return ApiResponse.success(res, users);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return ApiResponse.notFound(res, 'User not found');
    return ApiResponse.success(res, user);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return ApiResponse.notFound(res, 'User not found');
    return ApiResponse.success(res, user, 'User updated');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return ApiResponse.notFound(res, 'User not found');
    await user.deleteOne();
    return ApiResponse.success(res, null, 'User deleted');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };