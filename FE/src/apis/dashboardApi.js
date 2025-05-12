import axios from 'axios';

const API_URL = process.env.BASE_URL || 'https://personal-budget-tracker-8d77.onrender.com/api';

export const dashboardService = {
  async getSummary() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/summary`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      if (response.data.body?.data) {
        return { success: true, data: response.data.body.data };
      } else {
        return { success: false, message: response.data.body?.message || 'Failed to retrieve summary data' };
      }
    } catch (error) {
      console.error('Dashboard summary error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  },
  
  async getCategoryAnalysis() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/category-analysis`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      if (response.data.body?.data) {
        return { success: true, data: response.data.body.data };
      } else {
        return { success: false, message: response.data.body?.message || 'Failed to retrieve category analysis' };
      }
    } catch (error) {
      console.error('Category analysis error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  },
  
  async getMonthlyOverview() {
    try {
      const response = await axios.get(`${API_URL}/dashboard/monthly-overview`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      if (response.data.body?.data) {
        return { success: true, data: response.data.body.data };
      } else {
        return { success: false, message: response.data.body?.message || 'Failed to retrieve monthly overview' };
      }
    } catch (error) {
      console.error('Monthly overview error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  },
  
  // Optional: Combined function to get all dashboard data at once
  async getAllDashboardData() {
    try {
      const [summaryResponse, categoryResponse, monthlyResponse] = await Promise.all([
        this.getSummary(),
        this.getCategoryAnalysis(),
        this.getMonthlyOverview()
      ]);
      
      if (summaryResponse.success && categoryResponse.success && monthlyResponse.success) {
        return {
          success: true,
          data: {
            summary: summaryResponse.data,
            categoryAnalysis: categoryResponse.data,
            monthlyOverview: monthlyResponse.data
          }
        };
      } else {
        return {
          success: false,
          message: 'Failed to retrieve complete dashboard data',
          partialData: {
            summary: summaryResponse.success ? summaryResponse.data : null,
            categoryAnalysis: categoryResponse.success ? categoryResponse.data : null,
            monthlyOverview: monthlyResponse.success ? monthlyResponse.data : null
          }
        };
      }
    } catch (error) {
      console.error('Dashboard data error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  }
};