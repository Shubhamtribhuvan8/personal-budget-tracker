import axios from 'axios';

const API_URL = process.env.BASE_URL || 'https://personal-budget-tracker-8d77.onrender.com/api';

export const transactionService = {
  async createTransaction(amount, description, type, categoryName, date = null) {
    try {
      const response = await axios.post(
        `${API_URL}/transactions`,
        { amount, description, type, categoryName, date },
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
        return { success: false, message: response.data.body?.message || 'Failed to create transaction' };
      }
    } catch (error) {
      console.error('Create transaction error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  async getTransactions(params = {}) {
    try {
      // Build query string from params
      const queryParams = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      const queryString = queryParams ? `?${queryParams}` : '';
      
      const response = await axios.get(
        `${API_URL}/transactions${queryString}`,
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
        return { success: false, message: response.data.body?.message || 'Failed to retrieve transactions' };
      }
    } catch (error) {
      console.error('Get transactions error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  async getTransactionById(transactionId) {
    try {
      const response = await axios.get(
        `${API_URL}/transactions/${transactionId}`,
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
        return { success: false, message: response.data.body?.message || 'Failed to retrieve transaction' };
      }
    } catch (error) {
      console.error('Get transaction by ID error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  async updateTransaction(transactionId, updateData) {
    try {
      const response = await axios.put(
        `${API_URL}/transactions/${transactionId}`,
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
        return { success: false, message: response.data.body?.message || 'Failed to update transaction' };
      }
    } catch (error) {
      console.error('Update transaction error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  async deleteTransaction(transactionId) {
    try {
      const response = await axios.delete(
        `${API_URL}/transactions/${transactionId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      
      if (response.status === 200) {
        return { success: true, message: response.data.body?.message || 'Transaction deleted successfully' };
      } else {
        return { success: false, message: response.data.body?.message || 'Failed to delete transaction' };
      }
    } catch (error) {
      console.error('Delete transaction error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  // Helper functions for common transaction operations
  
  async getRecentTransactions(limit = 5) {
    return this.getTransactions({ limit, page: 1 });
  },
  
  async getIncomeTransactions(params = {}) {
    return this.getTransactions({ ...params, type: 'income' });
  },
  
  async getExpenseTransactions(params = {}) {
    return this.getTransactions({ ...params, type: 'expense' });
  },
  
  async getTransactionsByCategory(categoryId, params = {}) {
    return this.getTransactions({ ...params, category: categoryId });
  },
  
  async getTransactionsByDateRange(startDate, endDate, params = {}) {
    return this.getTransactions({ 
      ...params, 
      startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
      endDate: endDate ? endDate.toISOString().split('T')[0] : undefined
    });
  },
  
  async getCurrentMonthTransactions() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return this.getTransactionsByDateRange(startOfMonth, endOfMonth);
  }
};