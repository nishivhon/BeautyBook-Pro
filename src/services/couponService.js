// Coupon API Service

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api';

export const couponService = {
  /**
   * Fetch all active coupons from the database
   */
  async getCoupons() {
    try {
      const response = await fetch(`${API_BASE}/coupons/read`);
      if (!response.ok) throw new Error('Failed to fetch coupons');
      const result = await response.json();
      return result.data || [];
    } catch (err) {
      console.error('Error loading coupons:', err);
      throw err;
    }
  },

  /**
   * Create a new coupon
   */
  async createCoupon(payload) {
    try {
      const response = await fetch(`${API_BASE}/coupons/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API Response:', result);
        throw new Error(result.details || result.error || 'Failed to create coupon');
      }

      return result.data;
    } catch (err) {
      console.error('Error creating coupon:', err);
      throw err;
    }
  },

  /**
   * Update an existing coupon
   */
  async updateCoupon(id, payload) {
    try {
      const response = await fetch(`${API_BASE}/coupons/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...payload })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update coupon');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Error updating coupon:', err);
      throw err;
    }
  },

  /**
   * Delete (soft delete) a coupon
   */
  async deleteCoupon(id) {
    try {
      const response = await fetch(`${API_BASE}/coupons/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete coupon');
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error('Error deleting coupon:', err);
      throw err;
    }
  }
};
