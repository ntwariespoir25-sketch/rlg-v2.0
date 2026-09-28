const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Home/General
  async getTestimonials() {
    return this.request('/testimonials');
  }

  async getPrograms() {
    return this.request('/programs');
  }

  async getUpcomingEvents() {
    return this.request('/events/upcoming');
  }

  async getStats() {
    return this.request('/dashboard/stats');
  }

  async getGallery() {
    return this.request('/gallery');
  }

  async getBlogs() {
    return this.request('/blogs');
  }

  async getBlogBySlug(slug) {
    return this.request(`/blogs/slug/${slug}`);
  }

  // Contact
  async submitContact(data) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Donations
  async submitDonation(data) {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get Involved
  async submitGetInvolved(data) {
    return this.request('/getinvolved', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Newsletter
  async subscribeNewsletter(email) {
    return this.request('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export default new ApiService();