import axios from 'axios';

const API_URL = process.env.BASE_URL || 'https://personal-budget-tracker-8d77.onrender.com/api';

export const budgetService = {
  async setBudget(month, year, category, amount) {
    try {
      const response = await axios.post(
        `${API_URL}/budgets`,
        { month, year, category, amount },
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
        return { success: false, message: response.data.body?.message || 'Failed to set budget' };
      }
    } catch (error) {
      console.error('Set budget error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  async getBudgets(month, year) {
    try {
      // Build query string
      const queryParams = [];
      if (month) queryParams.push(`month=${month}`);
      if (year) queryParams.push(`year=${year}`);
      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
      
      const response = await axios.get(
        `${API_URL}/budgets${queryString}`,
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
        return { success: false, message: response.data.body?.message || 'Failed to retrieve budgets' };
      }
    } catch (error) {
      console.error('Get budgets error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  async deleteBudget(budgetId) {
    try {
      const response = await axios.delete(
        `${API_URL}/budgets/${budgetId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      
      if (response.status === 200) {
        return { success: true, message: response.data.body?.message || 'Budget deleted successfully' };
      } else {
        return { success: false, message: response.data.body?.message || 'Failed to delete budget' };
      }
    } catch (error) {
      console.error('Delete budget error:', error);
      return { 
        success: false, 
        message: error.response?.data?.body?.message || 'Network error occurred' 
      };
    }
  },
  
  // Helper function to get current month's budget status
  async getCurrentMonthBudgets() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    const currentYear = currentDate.getFullYear();
    
    return this.getBudgets(currentMonth, currentYear);
  },
  
  // Optional: Get budget status for a specific category
  async getCategoryBudgetStatus(categoryId, month, year) {
    try {
      const budgetsResponse = await this.getBudgets(month, year);
      
      if (!budgetsResponse.success) {
        return budgetsResponse; // Return error
      }
      
      const categoryBudget = budgetsResponse.data.budgets.find(
        budget => budget.category.id === categoryId
      );
      
      if (!categoryBudget) {
        return { 
          success: true, 
          data: null, 
          message: 'No budget found for this category' 
        };
      }
      
      return {
        success: true,
        data: categoryBudget
      };
    } catch (error) {
      console.error('Get category budget status error:', error);
      return { success: false, message: 'Error retrieving category budget' };
    }
  }
};