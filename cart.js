/**
 * CraveNest - Cart Management Engine
 * Implements a Singleton Cart Manager with LocalStorage persistence,
 * event pub/sub system for cross-component reactivity, and robust price calculations.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'CRAVENEST_CART_V1';
  const COUPON_KEY = 'CRAVENEST_ACTIVE_COUPON';
  const TIP_KEY = 'CRAVENEST_DELIVERY_TIP';

  class CartManager {
    constructor() {
      this.items = this.loadCart();
      this.activeCoupon = this.loadCoupon();
      this.deliveryTip = this.loadTip();
    }

    /**
     * Loads cart items from LocalStorage safely with schema fallback
     * @returns {Array} Array of cart item objects
     */
    loadCart() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error('Failed to load cart from storage:', e);
        return [];
      }
    }

    /**
     * Saves cart state to LocalStorage and broadcasts update event
     */
    saveCart() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      } catch (e) {
        console.error('Failed to save cart to storage:', e);
      }
      this.notifySubscribers();
    }

    loadCoupon() {
      try {
        const saved = localStorage.getItem(COUPON_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch (e) {
        return null;
      }
    }

    saveCoupon(coupon) {
      this.activeCoupon = coupon;
      if (coupon) {
        localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(COUPON_KEY);
      }
      this.notifySubscribers();
    }

    loadTip() {
      const tip = localStorage.getItem(TIP_KEY);
      return tip ? parseFloat(tip) : 0;
    }

    setDeliveryTip(amount) {
      this.deliveryTip = Math.max(0, parseFloat(amount) || 0);
      localStorage.setItem(TIP_KEY, this.deliveryTip.toString());
      this.notifySubscribers();
    }

    /**
     * Dispatches custom event to notify all UI parts across the app
     */
    notifySubscribers() {
      const event = new CustomEvent('cart:updated', {
        detail: {
          items: this.items,
          count: this.getTotalCount(),
          calculations: this.getCalculations()
        }
      });
      window.dispatchEvent(event);
    }

    /**
     * Adds dish to cart or increments existing quantity
     * @param {string|number} dishId 
     * @param {number} qty 
     * @returns {object} updated item
     */
    addItem(dishId, qty = 1) {
      // Find dish details from global dataset
      const dish = CRAVENEST_DATA.dishes.find(d => d.id === dishId);
      if (!dish) {
        console.error(`Dish with id ${dishId} not found`);
        return null;
      }

      const existingIndex = this.items.findIndex(item => item.id === dishId);

      if (existingIndex > -1) {
        this.items[existingIndex].quantity += qty;
      } else {
        this.items.push({
          id: dish.id,
          name: dish.name,
          restaurantId: dish.restaurantId,
          restaurantName: dish.restaurantName,
          price: dish.price,
          originalPrice: dish.originalPrice,
          image: dish.image,
          isVeg: dish.isVeg,
          quantity: Math.max(1, qty)
        });
      }

      this.saveCart();

      // Dispatch specific notification event
      window.dispatchEvent(new CustomEvent('cart:item-added', {
        detail: { dish, quantity: qty }
      }));

      return this.getItem(dishId);
    }

    /**
     * Updates specific dish quantity; removes item if quantity becomes <= 0
     * @param {string} dishId 
     * @param {number} newQuantity 
     */
    updateQuantity(dishId, newQuantity) {
      const targetIndex = this.items.findIndex(item => item.id === dishId);
      if (targetIndex === -1) return;

      if (newQuantity <= 0) {
        this.removeItem(dishId);
      } else {
        this.items[targetIndex].quantity = newQuantity;
        this.saveCart();
      }
    }

    /**
     * Increments quantity of existing dish by 1
     */
    incrementItem(dishId) {
      const item = this.getItem(dishId);
      if (item) {
        this.updateQuantity(dishId, item.quantity + 1);
      } else {
        this.addItem(dishId, 1);
      }
    }

    /**
     * Decrements quantity of existing dish by 1
     */
    decrementItem(dishId) {
      const item = this.getItem(dishId);
      if (item) {
        this.updateQuantity(dishId, item.quantity - 1);
      }
    }

    /**
     * Removes item completely from the cart
     */
    removeItem(dishId) {
      this.items = this.items.filter(item => item.id !== dishId);
      this.saveCart();
    }

    /**
     * Clears all items and active vouchers from the cart
     */
    clearCart() {
      this.items = [];
      this.activeCoupon = null;
      this.deliveryTip = 0;
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COUPON_KEY);
      localStorage.removeItem(TIP_KEY);
      this.notifySubscribers();
    }

    /**
     * Checks if item exists in cart and returns item or null
     */
    getItem(dishId) {
      return this.items.find(item => item.id === dishId) || null;
    }

    /**
     * Returns total item count (sum of all quantities)
     */
    getTotalCount() {
      return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Applies a discount coupon voucher code
     * @param {string} code 
     * @returns {object} { success: boolean, message: string }
     */
    applyCoupon(code) {
      if (!code) {
        return { success: false, message: 'Please enter a valid coupon code.' };
      }

      const coupon = CRAVENEST_DATA.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
      if (!coupon) {
        return { success: false, message: `Coupon "${code}" is invalid or expired.` };
      }

      const subtotal = this.getSubtotal();
      if (subtotal < coupon.minOrder) {
        return {
          success: false,
          message: `Minimum order of ₹${coupon.minOrder} required for ${coupon.code}. Add ₹${coupon.minOrder - subtotal} more.`
        };
      }

      this.saveCoupon(coupon);
      return {
        success: true,
        message: `Hooray! Coupon "${coupon.code}" applied successfully!`
      };
    }

    /**
     * Removes active coupon
     */
    removeCoupon() {
      this.saveCoupon(null);
    }

    /**
     * Computes raw food subtotal
     */
    getSubtotal() {
      return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    /**
     * Calculates complete financial breakdown
     */
    getCalculations() {
      const subtotal = this.getSubtotal();
      const pricing = CRAVENEST_DATA.pricing;

      // Delivery Fee calculation (Free delivery above threshold or with FREESHIP coupon)
      let deliveryFee = 0;
      let isFreeDelivery = false;

      if (subtotal > 0) {
        if (subtotal >= pricing.deliveryFreeThreshold || (this.activeCoupon && this.activeCoupon.freeDelivery)) {
          deliveryFee = 0;
          isFreeDelivery = true;
        } else {
          deliveryFee = pricing.deliveryBaseFee;
        }
      }

      // Platform fee
      const platformFee = subtotal > 0 ? pricing.platformFee : 0;

      // GST & Restaurant packaging charges (5%)
      const gst = Math.round(subtotal * pricing.gstRate);

      // Coupon discount calculation
      let discount = 0;
      if (this.activeCoupon && subtotal >= this.activeCoupon.minOrder) {
        if (this.activeCoupon.discountPercent) {
          const rawDiscount = (subtotal * this.activeCoupon.discountPercent) / 100;
          discount = Math.min(rawDiscount, this.activeCoupon.maxDiscount || rawDiscount);
        } else if (this.activeCoupon.flatDiscount) {
          discount = this.activeCoupon.flatDiscount;
        }
      }

      // Final Grand Total
      const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + gst + this.deliveryTip - discount);

      return {
        subtotal,
        deliveryFee,
        isFreeDelivery,
        platformFee,
        gst,
        discount,
        activeCoupon: this.activeCoupon,
        deliveryTip: this.deliveryTip,
        grandTotal: Math.round(grandTotal),
        freeDeliveryDiff: Math.max(0, pricing.deliveryFreeThreshold - subtotal)
      };
    }
  }

  // Instantiate singleton
  window.cartManager = new CartManager();

})(window);

