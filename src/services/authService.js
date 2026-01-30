const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://github.com/Parth8155/eduVision_deploy.git/api';
console.log(API_BASE_URL)
const authService = {
  // Login user
  async login(loginData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (result.success && result.data?.accessToken) {
        // Store access token in localStorage
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  },

  // Register user
  async register(registerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (result.success && result.data?.accessToken) {
        localStorage.setItem('accessToken', result.data.accessToken);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
  },

  // Logout user
  async logout() {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  // Refresh access token
  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      const result = await response.json();

      if (result.success && result.data?.accessToken) {
        localStorage.setItem('accessToken', result.data.accessToken);
        return result.data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.getAccessToken()}`,
        },
        credentials: 'include',
      });

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Helper methods
  getAccessToken() {
    return localStorage.getItem('accessToken');
  },

  getCurrentUser() {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  },

  isAuthenticated() {
    return !!this.getAccessToken();
  },

  // Check if token is expired or about to expire
  isTokenExpired(token) {
    try {
      if (!token) return true;
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      const payload = JSON.parse(atob(parts[1]));
      if (!payload.exp) return false; // No expiry, assume valid
      
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = payload.exp - now;
      
      // Token is expired or will expire in less than 5 minutes
      return timeLeft < 300;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true; // Assume expired on error
    }
  },

  // Initialize authentication on app startup
  async initializeAuth() {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    try {
      // Check if token is expired or about to expire
      if (this.isTokenExpired(token)) {
        // Token expired, try to refresh
        const newToken = await this.refreshToken();
        if (newToken) {
          this.setupTokenRefresh();
          return true;
        } else {
          // Refresh failed, clear stored data
          this.clearAuthData();
          return false;
        }
      } else {
        // Token is still valid, just setup auto-refresh
        this.setupTokenRefresh();
        return true;
      }
    } catch (error) {
      console.error('Token validation failed on initialization:', error);
      // Only clear if token is actually expired
      if (this.isTokenExpired(token)) {
        this.clearAuthData();
        return false;
      }
      // If token not expired but some other error, keep it and try to continue
      return true;
    }
  },

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  // Auto-refresh token before it expires
  setupTokenRefresh() {
    const token = this.getAccessToken();
    if (token) {
      // Refresh token every 50 minutes (tokens expire in 1 hour)
      setInterval(async () => {
        await this.refreshToken();
      }, 50 * 60 * 1000);
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send reset email');
      }

      return result;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(token, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to reset password');
      }

      return result;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
};

export default authService;
