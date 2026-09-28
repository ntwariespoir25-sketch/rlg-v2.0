const Blog = require('../models/Blog.model');
const { ApiResponse } = require('../utils/apiResponse');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = { status: 'published' };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }
    
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'name');
    
    const total = await Blog.countDocuments(query);
    
    return ApiResponse.success(res, {
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get blog by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, status: 'published' }).populate('author', 'name');
    if (!blog) {
      return ApiResponse.notFound(res, 'Blog not found');
    }
    return ApiResponse.success(res, blog);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name');
    if (!blog) {
      return ApiResponse.notFound(res, 'Blog not found');
    }
    return ApiResponse.success(res, blog);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      ...req.body,
      author: req.admin._id,
    });
    return ApiResponse.created(res, blog);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return ApiResponse.notFound(res, 'Blog not found');
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    return ApiResponse.success(res, updatedBlog, 'Blog updated successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return ApiResponse.notFound(res, 'Blog not found');
    }
    
    await blog.deleteOne();
    return ApiResponse.success(res, null, 'Blog deleted successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Publish blog
// @route   PATCH /api/blogs/:id/publish
// @access  Private/Admin
const publishBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return ApiResponse.notFound(res, 'Blog not found');
    }
    
    blog.status = 'published';
    blog.publishedAt = new Date();
    await blog.save();
    
    return ApiResponse.success(res, blog, 'Blog published successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Archive blog
// @route   PATCH /api/blogs/:id/archive
// @access  Private/Admin
const archiveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return ApiResponse.notFound(res, 'Blog not found');
    }
    
    blog.status = 'archived';
    await blog.save();
    
    return ApiResponse.success(res, blog, 'Blog archived successfully');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Like blog
// @route   POST /api/blogs/:id/like
// @access  Public
const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return ApiResponse.notFound(res, 'Blog not found');
    }
    
    blog.likes += 1;
    await blog.save();
    
    return ApiResponse.success(res, { likes: blog.likes }, 'Blog liked');
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Add view
// @route   POST /api/blogs/:id/view
// @access  Public
const addView = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return ApiResponse.notFound(res, 'Blog not found');
    }
    
    blog.views += 1;
    await blog.save();
    
    return ApiResponse.success(res, { views: blog.views });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get blogs by category
// @route   GET /api/blogs/category/:category
// @access  Public
const getBlogsByCategory = async (req, res) => {
  try {
    const blogs = await Blog.find({ 
      category: req.params.category,
      status: 'published' 
    }).populate('author', 'name');
    
    return ApiResponse.success(res, blogs);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

// @desc    Get blog stats
// @route   GET /api/blogs/stats
// @access  Public
const getBlogStats = async (req, res) => {
  try {
    const total = await Blog.countDocuments({ status: 'published' });
    const categories = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    return ApiResponse.success(res, { total, categories });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  archiveBlog,
  likeBlog,
  addView,
  getBlogsByCategory,
  getBlogStats,
};