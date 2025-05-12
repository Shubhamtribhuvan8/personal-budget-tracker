import axios from 'axios';

const API_URL = process.env.BASE_URL || 'https://personal-budget-tracker-8d77.onrender.com/api';

export const categoryService = {
  async createCategory(name, type, color = null, isActive = true) {
    try {
      const response = await axios.post(
        `${API_URL}/categories`,
        { name, type, color, isActive },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      
      if (response.data.body?.data) {
        return { success: true, data: response.data.body.data };
      } else {
        return { success: false, message: response.data.body?.message || 'Failed to create category' };
      }
    } catch (error) {
      console.error('Create category error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  async getCategories(type = null) {
    try {
      // Build query string for type filter
      const queryString = type ? `?type=${type}` : '';
      
      const response = await axios.get(
        `${API_URL}/categories${queryString}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      
      if (response.data.body?.data) {
        return { success: true, data: response.data.body.data };
      } else {
        return { success: false, message: response.data.body?.message || 'Failed to retrieve categories' };
      }
    } catch (error) {
      console.error('Get categories error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  async updateCategory(categoryId, name, color, isActive) {
    try {
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (color !== undefined) updateData.color = color;
      if (isActive !== undefined) updateData.isActive = isActive;
      
      const response = await axios.put(
        `${API_URL}/categories/${categoryId}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      
      if (response.data.body?.data) {
        return { success: true, data: response.data.body.data };
      } else {
        return { success: false, message: response.data.body?.message || 'Failed to update category' };
      }
    } catch (error) {
      console.error('Update category error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  async deleteCategory(categoryId) {
    try {
      const response = await axios.delete(
        `${API_URL}/categories/${categoryId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      
      if (response.status === 200) {
        return { success: true, message: response.data.body?.message || 'Category deleted successfully' };
      } else {
        return { success: false, message: response.data.body?.message || 'Failed to delete category' };
      }
    } catch (error) {
      console.error('Delete category error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  async getIncomeCategories() {
    return this.getCategories('income');
  },
  
  async getExpenseCategories() {
    return this.getCategories('expense');
  },
  
  async getCategoryById(categoryId) {
    try {
      const response = await axios.get(
        `${API_URL}/categories/${categoryId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      
      if (response.data.body?.data) {
        return {
          success: true,
          data: response.data.body.data
        };
      } else {
        return {
          success: false,
          message: response.data.body?.message || 'Category not found'
        };
      }
    } catch (error) {
      console.error('Get category by ID error:', error);
      return { success: false, message: 'Error retrieving category' };
    }
  },
  
  // Helper method to toggle category active status
  async toggleCategoryStatus(categoryId, isActive) {
    return this.updateCategory(categoryId, undefined, undefined, isActive);
  }
};