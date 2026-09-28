module.exports = {
  // User Roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
    MODERATOR: 'moderator',
  },
  
  // Blog Status
  BLOG_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
  },
  
  // Program Types
  PROGRAM_TYPES: {
    SCHOOL_LEADERSHIP: 'school_leadership',
    TOURNAMENTS: 'tournaments',
    FORUMS: 'forums',
  },
  
  // Donation Status
  DONATION_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },
  
  // Payment Methods
  PAYMENT_METHODS: {
    MOBILE_MONEY: 'mobile_money',
    BANK_TRANSFER: 'bank_transfer',
    CREDIT_CARD: 'credit_card',
  },
  
  // Event Status
  EVENT_STATUS: {
    UPCOMING: 'upcoming',
    ONGOING: 'ongoing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  
  // Cache Keys
  CACHE_KEYS: {
    BLOGS: 'blogs',
    PROGRAMS: 'programs',
    EVENTS: 'events',
    TESTIMONIALS: 'testimonials',
    GALLERY: 'gallery',
    STATS: 'stats',
  },
  
  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};