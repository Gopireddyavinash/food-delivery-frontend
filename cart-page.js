/**
 * CraveNest - Cart Page Controller & Checkout Flow
 * Manages cart item rendering, steppers, promo codes, delivery tips,
 * checkout modal, and simulated real-time order tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
  const cartPage = new CartPageController();
  cartPage.init();
});

class CartPageController {
  constructor() {
    this.selectedAddress = 'home';
    this.instructionSelected = [];
  }

  init() {
    this.renderCart();
    this.bindEvents();

    // Re-render when cart updates
    window.addEventListener('cart:updated', () => {
      this.renderCart();
    });
  }

  bindEvents() {
    // Delivery Tip Selection delegation
    const tipContainer = document.getElementById('cart-tip-container');
    if (tipContainer) {
      tipContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.tip-chip');
        if (chip) {
          const amount = parseFloat(chip.getAttribute('data-tip')) || 0;
          window.cartManager.setDeliveryTip(amount);
          tipContainer.querySelectorAll('.tip-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        }
      });
    }

    // Coupon Code submission
    const couponForm = document.getElementById('coupon-apply-form');
    if (couponForm) {
      couponForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('coupon-input');
        if (input) {
          const res = window.cartManager.applyCoupon(input.value);
          if (res.success) {
            window.showToast(res.message, 'success');
            input.value = '';
          } else {
            window.showToast(res.message, 'error');
          }
        }
      });
    }

    // Quick Coupon Chips delegation
    const quickCoupons = document.getElementById('quick-coupons-list');
    if (quickCoupons) {
      quickCoupons.addEventListener('click', (e) => {
        const applyBtn = e.target.closest('.btn-apply-coupon');
        if (applyBtn) {
          const code = applyBtn.getAttribute('data-code');
          const res = window.cartManager.applyCoupon(code);
          if (res.success) {
            window.showToast(res.message, 'success');
          } else {
            window.showToast(res.message, 'error');
          }
        }
      });
    }

    // Remove active coupon
    const billContainer = document.getElementById('cart-bill-details');
    if (billContainer) {
      billContainer.addEventListener('click', (e) => {
        const removeCouponBtn = e.target.closest('.btn-remove-coupon');
        if (removeCouponBtn) {
          window.cartManager.removeCoupon();
          window.showToast('Coupon voucher removed', 'info');
        }
      });
    }

    // Steppers and remove item delegation in cart items list
    const itemsList = document.getElementById('cart-items-list');
    if (itemsList) {
      itemsList.addEventListener('click', (e) => {
        const incBtn = e.target.closest('.btn-inc');
        const decBtn = e.target.closest('.btn-dec');
        const deleteBtn = e.target.closest('.btn-remove-cart-item');

        if (incBtn) {
          const id = incBtn.getAttribute('data-id');
          window.cartManager.incrementItem(id);
        } else if (decBtn) {
          const id = decBtn.getAttribute('data-id');
          window.cartManager.decrementItem(id);
        } else if (deleteBtn) {
          const id = deleteBtn.getAttribute('data-id');
          window.cartManager.removeItem(id);
          window.showToast('Item removed from cart', 'info');
        }
      });
    }

    // Address selector cards
    const addressCards = document.querySelectorAll('.address-card-option');
    addressCards.forEach(card => {
      card.addEventListener('click', () => {
        addressCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedAddress = card.getAttribute('data-address-type');
      });
    });

    // Delivery instruction chips
    const instructionChips = document.querySelectorAll('.instruction-chip');
    instructionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
      });
    });

    // Checkout modal trigger
    const proceedBtn = document.getElementById('btn-proceed-checkout');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => this.openCheckoutModal());
    }
  }

  renderCart() {
    const items = window.cartManager.items;
    const calc = window.cartManager.getCalculations();

    const emptyView = document.getElementById('cart-empty-view');
    const filledView = document.getElementById('cart-filled-view');

    if (!emptyView || !filledView) return;

    if (items.length === 0) {
      emptyView.classList.remove('hidden');
      filledView.classList.add('hidden');
      return;
    }

    emptyView.classList.add('hidden');
    filledView.classList.remove('hidden');

    this.renderItemsList(items);
    this.renderBillDetails(calc);
    this.renderCouponsList();
  }

  renderItemsList(items) {
    const list = document.getElementById('cart-items-list');
    const restHeader = document.getElementById('cart-restaurant-name');
    if (!list) return;

    if (restHeader && items.length > 0) {
      restHeader.innerHTML = `<i class="fa-solid fa-utensils"></i> Ordering from <strong>${items[0].restaurantName}</strong>`;
    }

    list.innerHTML = items.map(item => `
      <div class="cart-item-row" data-id="${item.id}">
        <div class="cart-item-left">
          <span class="food-diet-badge ${item.isVeg ? 'diet-veg' : 'diet-nonveg'}">
            <span class="diet-dot"></span>
          </span>
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <span class="cart-item-unit-price">₹${item.price} each</span>
          </div>
        </div>

        <div class="cart-item-right">
          <div class="qty-stepper">
            <button type="button" class="stepper-btn btn-dec" data-id="${item.id}" aria-label="Decrease quantity">-</button>
            <span class="stepper-count">${item.quantity}</span>
            <button type="button" class="stepper-btn btn-inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <span class="cart-item-subtotal">₹${item.price * item.quantity}</span>
          <button type="button" class="btn-remove-cart-item" data-id="${item.id}" title="Remove item" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  renderBillDetails(calc) {
    const container = document.getElementById('cart-bill-details');
    const checkoutTotal = document.getElementById('btn-checkout-total');
    if (!container) return;

    if (checkoutTotal) {
      checkoutTotal.textContent = `₹${calc.grandTotal}`;
    }

    container.innerHTML = `
      <div class="bill-row">
        <span>Item Total (Subtotal)</span>
        <span>₹${calc.subtotal}</span>
      </div>

      <div class="bill-row">
        <span>
          Delivery Partner Fee 
          ${calc.isFreeDelivery ? '<span class="free-pill">FREE</span>' : ''}
        </span>
        <span>${calc.isFreeDelivery ? '<s class="striked">₹40</s> ₹0' : `₹${calc.deliveryFee}`}</span>
      </div>

      ${calc.freeDeliveryDiff > 0 ? `
        <div class="free-delivery-banner">
          <i class="fa-solid fa-truck-fast"></i> Add <strong>₹${calc.freeDeliveryDiff}</strong> more to unlock <strong>FREE Delivery!</strong>
        </div>
      ` : ''}

      <div class="bill-row">
        <span>Platform Fee</span>
        <span>₹${calc.platformFee}</span>
      </div>

      <div class="bill-row">
        <span>GST & Restaurant Packaging Charges (5%)</span>
        <span>₹${calc.gst}</span>
      </div>

      ${calc.deliveryTip > 0 ? `
        <div class="bill-row tip-row">
          <span>Delivery Tip (Direct to Rider)</span>
          <span>₹${calc.deliveryTip}</span>
        </div>
      ` : ''}

      ${calc.discount > 0 ? `
        <div class="bill-row discount-row">
          <span class="discount-label">
            <i class="fa-solid fa-tag"></i> Coupon Savings (${calc.activeCoupon.code})
            <button type="button" class="btn-remove-coupon" title="Remove coupon">&times;</button>
          </span>
          <span class="discount-amount">- ₹${calc.discount}</span>
        </div>
      ` : ''}

      <div class="bill-divider"></div>

      <div class="bill-row total-row">
        <span class="total-label">TO PAY</span>
        <span class="total-amount">₹${calc.grandTotal}</span>
      </div>

      <div class="savings-tag">
        <i class="fa-solid fa-circle-check"></i> You saved ₹${calc.discount + (calc.isFreeDelivery ? 40 : 0)} on this feast!
      </div>
    `;
  }

  renderCouponsList() {
    const container = document.getElementById('quick-coupons-list');
    if (!container || !CRAVENEST_DATA) return;

    const activeCode = window.cartManager.activeCoupon?.code;

    container.innerHTML = CRAVENEST_DATA.coupons.map(coupon => `
      <div class="coupon-card-mini ${activeCode === coupon.code ? 'is-active' : ''}">
        <div class="coupon-mini-left">
          <div class="coupon-code-badge">${coupon.code}</div>
          <p class="coupon-mini-desc">${coupon.description}</p>
        </div>
        <button type="button" class="btn-apply-coupon" data-code="${coupon.code}">
          ${activeCode === coupon.code ? 'APPLIED' : 'APPLY'}
        </button>
      </div>
    `).join('');
  }

  openCheckoutModal() {
    const calc = window.cartManager.getCalculations();
    if (calc.grandTotal <= 0) return;

    let modal = document.getElementById('checkout-payment-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'checkout-payment-modal';
      modal.className = 'modal-wrapper';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog modal-checkout-dialog">
        <button type="button" class="modal-close-icon" aria-label="Close dialog">&times;</button>
        
        <div class="checkout-modal-content" id="checkout-view-step">
          <h2 class="modal-title">Select Payment Mode</h2>
          <p class="modal-subtitle">Pay securely to confirm your order of <strong>₹${calc.grandTotal}</strong></p>

          <div class="payment-methods-list">
            <label class="payment-method-card selected">
              <input type="radio" name="payment_method" value="upi" checked />
              <div class="pay-icon-box"><i class="fa-solid fa-mobile-screen-button"></i></div>
              <div class="pay-meta">
                <strong>Instant UPI (Google Pay, PhonePe, Paytm)</strong>
                <span>Fastest & recommended</span>
              </div>
            </label>

            <label class="payment-method-card">
              <input type="radio" name="payment_method" value="card" />
              <div class="pay-icon-box"><i class="fa-solid fa-credit-card"></i></div>
              <div class="pay-meta">
                <strong>Credit / Debit Card</strong>
                <span>Visa, MasterCard, RuPay, Amex</span>
              </div>
            </label>

            <label class="payment-method-card">
              <input type="radio" name="payment_method" value="cod" />
              <div class="pay-icon-box"><i class="fa-solid fa-money-bill-wave"></i></div>
              <div class="pay-meta">
                <strong>Cash / Pay on Delivery</strong>
                <span>Pay via cash or QR scanner at door</span>
              </div>
            </label>
          </div>

          <div class="modal-footer-action">
            <button type="button" class="btn-place-order" id="btn-confirm-pay">
              Pay ₹${calc.grandTotal} & Place Order <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');

    const closeModal = () => modal.classList.remove('open');
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.modal-close-icon').addEventListener('click', closeModal);

    // Method selection style toggle
    const methodCards = modal.querySelectorAll('.payment-method-card');
    methodCards.forEach(card => {
      card.addEventListener('click', () => {
        methodCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });

    // Place Order button
    const confirmBtn = modal.querySelector('#btn-confirm-pay');
    confirmBtn.addEventListener('click', () => {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Confirming with Kitchen...`;

      setTimeout(() => {
        this.renderOrderSuccessScreen(modal, calc);
      }, 1200);
    });
  }

  renderOrderSuccessScreen(modal, calc) {
    const orderId = 'CN-' + Math.floor(100000 + Math.random() * 900000);
    const container = modal.querySelector('.modal-checkout-dialog');

    // Clear cart immediately
    window.cartManager.clearCart();

    container.innerHTML = `
      <div class="order-success-container">
        <div class="success-animation-circle">
          <i class="fa-solid fa-check"></i>
        </div>
        <h2 class="order-success-title">Order Confirmed! 🎉</h2>
        <p class="order-success-subtitle">The restaurant has accepted your order and started cooking.</p>
        
        <div class="order-meta-box">
          <div class="order-meta-row">
            <span>Order ID:</span>
            <strong>#${orderId}</strong>
          </div>
          <div class="order-meta-row">
            <span>Amount Paid:</span>
            <strong>₹${calc.grandTotal}</strong>
          </div>
          <div class="order-meta-row">
            <span>Estimated Delivery:</span>
            <strong class="text-orange">25 - 30 mins</strong>
          </div>
        </div>

        <!-- Live Step Tracker -->
        <div class="order-live-tracker">
          <div class="tracker-step done">
            <div class="tracker-icon"><i class="fa-solid fa-check"></i></div>
            <div class="tracker-text">
              <strong>Order Placed</strong>
              <span>Received by Kitchen</span>
            </div>
          </div>
          <div class="tracker-step active-pulse">
            <div class="tracker-icon"><i class="fa-solid fa-kitchen-set"></i></div>
            <div class="tracker-text">
              <strong>Preparing Meal</strong>
              <span>Chef is crafting your dishes</span>
            </div>
          </div>
          <div class="tracker-step">
            <div class="tracker-icon"><i class="fa-solid fa-motorcycle"></i></div>
            <div class="tracker-text">
              <strong>On the Way</strong>
              <span>Delivery partner assigned</span>
            </div>
          </div>
        </div>

        <div class="order-success-actions">
          <a href="index.html" class="btn-success-home">Back to Home</a>
          <a href="restaurants.html" class="btn-success-browse">Order More Delicious Food</a>
        </div>
      </div>
    `;

    window.showToast(`Order #${orderId} placed successfully! 🚀`, 'success', 5000);
  }
}

