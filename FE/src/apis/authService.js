import axios from 'axios';

const API_URL = process.env.BASE_URL|| 'https://personal-budget-tracker-8d77.onrender.com/api';

export const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, 
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true // Important for cookies
        }
      );
      
      if (response.data.body?.data) {
        // Store tokens in localStorage and manage user state
        if (response.data.body.data.accessToken) {
          localStorage.setItem('accessToken', response.data.body.data.accessToken);
          localStorage.setItem('user', JSON.stringify({
            email: response.data.body.data.email,
            name: response.data.body.data.name,
            isAdmin: response.data.body.data.isAdmin || false
          }));
          
          return { success: true, data: response.data.body.data };
        }
        return { success: false, message: 'Invalid response format' };
      } else {
        return { success: false, message: response.data.body?.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  },
  
  async signup(name, email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`,
        { name, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data.body?.data) {
        // Store tokens in localStorage and manage user state
        if (response.data.body?.data.accessToken) {
          localStorage.setItem('accessToken', response.data.body?.data.accessToken);
          localStorage.setItem('user', JSON.stringify({
            email: response.data.body?.data.email,
            name: response.data.body?.data.name
          }));
          
          return { success: true, data: response.data.body?.data };
        }
        return { success: false, message: 'Invalid response format' };
      } else {
        return { success: false, message: response.data.body?.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  },
  
  async logout() {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`, null, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        withCredentials: true // Important for cookies
      });

      if (response.status === 200) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      } else {
        // Clear local storage regardless of server response
        localStorage.removeItem('accessToken'); 
        localStorage.removeItem('user');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage on error
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return { success: false, message: 'Error during logout' };
    }
  },
  
  refreshToken: async () => {
    try {
      const response = await axios.post(`${API_URL}/refresh-token`, null, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // Important for cookies
      });
      
      if (response.data.data && response.data.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        return { success: true, accessToken: response.data.data.accessToken };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false };
    }
  },
  
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
      return null;
    }
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }
};
