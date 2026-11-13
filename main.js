/**
 * CraveNest - Global UI Controller & Interactivity
 * Handles Navbar sticky states, mobile off-canvas navigation, active links,
 * live cart badge sync, global toast notifications, modal managers,
 * and shared card component renderers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initActiveNavLink();
  initMobileMenu();
  initCartBadges();
  initToastListener();
  initLocationSelector();
  initGlobalSearch();
  initGlobalCartSync();
});

/**
 * Adds dynamic elevation and backdrop blur to navbar on scroll
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.site-header');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('header-scrolled');
    } else {
      navbar.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check on load
}

/**
 * Highlights current active page in the navigation bar
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .bottom-nav-item');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const linkPath = href.split('/').pop().split('?')[0];
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Mobile Drawer Menu controls
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const closeBtn = document.querySelector('.drawer-close-btn');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * Keeps all cart badge counts synchronized with cartManager across tabs & pages
 */
function initCartBadges() {
  const updateBadge = () => {
    if (!window.cartManager) return;
    const count = window.cartManager.getTotalCount();
    const badges = document.querySelectorAll('.cart-count-badge');

    badges.forEach(badge => {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.add('has-items');
        badge.classList.remove('badge-pop');
        void badge.offsetWidth; // Force reflow
        badge.classList.add('badge-pop');
      } else {
        badge.classList.remove('has-items');
      }
    });
  };

  updateBadge();
  window.addEventListener('cart:updated', updateBadge);
}

/**
 * Listens for cart item additions and shows toast notifications
 */
function initToastListener() {
  window.addEventListener('cart:item-added', (e) => {
    const dish = e.detail.dish;
    if (dish) {
      showToast(`Added "${dish.name}" to your cart! 🛍️`, 'success');
    }
  });
}

/**
 * Global Toast Notification Generator
 * @param {string} message 
 * @param {'success'|'info'|'warning'|'error'} type 
 * @param {number} duration 
 */
function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;

  const iconMap = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
  };

  toast.innerHTML = `
    <div class="toast-content">
      <i class="fa-solid ${iconMap[type] || 'fa-bell'} toast-icon"></i>
      <span class="toast-text">${message}</span>
    </div>
    <button class="toast-close" aria-label="Close notification">&times;</button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  const closeToast = () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
    }, 300);
  };

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', closeToast);

  setTimeout(closeToast, duration);
}

window.showToast = showToast;

/**
 * Location Picker dropdown simulation
 */
function initLocationSelector() {
  const locationPills = document.querySelectorAll('.location-picker');
  const modal = document.querySelector('.location-modal');
  const modalOverlay = document.querySelector('.location-modal-overlay');

  if (!locationPills.length) return;

  const savedLoc = localStorage.getItem('CRAVENEST_LOCATION') || 'Indiranagar, Bengaluru';
  updateLocationText(savedLoc);

  locationPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (modal) {
        modal.classList.add('open');
        if (modalOverlay) modalOverlay.classList.add('open');
      }
    });
  });

  const closeLocModal = () => {
    if (modal) modal.classList.remove('open');
    if (modalOverlay) modalOverlay.classList.remove('open');
  };

  if (modalOverlay) modalOverlay.addEventListener('click', closeLocModal);
  
  const closeButtons = document.querySelectorAll('.close-loc-modal');
  closeButtons.forEach(btn => btn.addEventListener('click', closeLocModal));

  const locOptions = document.querySelectorAll('.location-item-option');
  locOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const selected = opt.getAttribute('data-location');
      if (selected) {
        localStorage.setItem('CRAVENEST_LOCATION', selected);
        updateLocationText(selected);
        showToast(`Delivery location set to ${selected} 📍`, 'success');
        closeLocModal();
      }
    });
  });
}

function updateLocationText(loc) {
  const elements = document.querySelectorAll('.current-location-text');
  elements.forEach(el => {
    el.textContent = loc;
  });
}

/**
 * Header Global Search routing
 */
function initGlobalSearch() {
  const searchForms = document.querySelectorAll('.global-search-form');
  searchForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="search"], input[type="text"]');
      if (input && input.value.trim()) {
        const query = encodeURIComponent(input.value.trim());
        window.location.href = `restaurants.html?search=${query}`;
      }
    });
  });
}

/**
 * Reusable Restaurant Card HTML generator
 */
function createRestaurantCardHTML(restaurant) {
  return `
    <article class="restaurant-card" data-id="${restaurant.id}">
      <a href="menu.html?id=${restaurant.id}" class="restaurant-card-link">
        <div class="restaurant-img-box">
          <img src="${restaurant.image}" alt="${restaurant.name}" loading="lazy" />
          ${restaurant.offer ? `<span class="offer-ribbon"><i class="fa-solid fa-tag"></i> ${restaurant.offer}</span>` : ''}
          ${restaurant.badge ? `<span class="badge-pill">${restaurant.badge}</span>` : ''}
          <div class="delivery-time-overlay">
            <i class="fa-solid fa-clock"></i> ${restaurant.deliveryTime}
          </div>
        </div>
        <div class="restaurant-info">
          <div class="restaurant-header-row">
            <h3 class="restaurant-title">${restaurant.name}</h3>
            <span class="rating-badge ${restaurant.rating >= 4.5 ? 'rating-high' : ''}">
              <i class="fa-solid fa-star"></i> ${restaurant.rating}
            </span>
          </div>
          <p class="restaurant-cuisines">${restaurant.cuisine.join(', ')}</p>
          <div class="restaurant-footer-meta">
            <span class="restaurant-price">${restaurant.priceForTwo}</span>
            <span class="meta-dot">&bull;</span>
            <span class="restaurant-dist"><i class="fa-solid fa-location-dot"></i> ${restaurant.distance}</span>
          </div>
        </div>
      </a>
    </article>
  `;
}
window.createRestaurantCardHTML = createRestaurantCardHTML;

/**
 * Reusable Food Card Generator with Veg/Non-Veg indicators & Quantity Steppers
 */
function createFoodCardHTML(dish) {
  const cartItem = window.cartManager ? window.cartManager.getItem(dish.id) : null;
  const inCart = Boolean(cartItem);
  const qty = cartItem ? cartItem.quantity : 0;

  return `
    <div class="food-card" data-id="${dish.id}">
      <div class="food-card-img-box">
        <img src="${dish.image}" alt="${dish.name}" loading="lazy" />
        <span class="food-diet-badge ${dish.isVeg ? 'diet-veg' : 'diet-nonveg'}">
          <span class="diet-dot"></span>
        </span>
        ${dish.badge ? `<span class="food-badge-tag">${dish.badge}</span>` : ''}
      </div>

      <div class="food-card-body">
        <div class="food-header-line">
          <h4 class="food-title">${dish.name}</h4>
          <span class="food-rating"><i class="fa-solid fa-star"></i> ${dish.rating}</span>
        </div>
        <p class="food-restaurant-ref"><i class="fa-solid fa-shop"></i> ${dish.restaurantName}</p>
        <p class="food-desc">${dish.description}</p>
        
        <div class="food-footer-line">
          <div class="food-price-box">
            <span class="current-price">₹${dish.price}</span>
            ${dish.originalPrice ? `<span class="original-price">₹${dish.originalPrice}</span>` : ''}
          </div>

          <div class="food-action-box" data-dish-id="${dish.id}">
            ${inCart ? `
              <div class="qty-stepper">
                <button type="button" class="stepper-btn btn-dec" data-id="${dish.id}" aria-label="Decrease quantity">-</button>
                <span class="stepper-count">${qty}</span>
                <button type="button" class="stepper-btn btn-inc" data-id="${dish.id}" aria-label="Increase quantity">+</button>
              </div>
            ` : `
              <button type="button" class="btn-add-food" data-id="${dish.id}">
                ADD <i class="fa-solid fa-plus"></i>
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}
window.createFoodCardHTML = createFoodCardHTML;

/**
 * Synchronizes buttons on screen with latest LocalStorage cart state without full re-render
 */
function syncDishCartButtons() {
  if (!window.cartManager) return;
  const actionBoxes = document.querySelectorAll('.food-action-box');

  actionBoxes.forEach(box => {
    const dishId = box.getAttribute('data-dish-id');
    if (!dishId) return;

    const cartItem = window.cartManager.getItem(dishId);
    if (cartItem && cartItem.quantity > 0) {
      box.innerHTML = `
        <div class="qty-stepper">
          <button type="button" class="stepper-btn btn-dec" data-id="${dishId}" aria-label="Decrease quantity">-</button>
          <span class="stepper-count">${cartItem.quantity}</span>
          <button type="button" class="stepper-btn btn-inc" data-id="${dishId}" aria-label="Increase quantity">+</button>
        </div>
      `;
    } else {
      box.innerHTML = `
        <button type="button" class="btn-add-food" data-id="${dishId}">
          ADD <i class="fa-solid fa-plus"></i>
        </button>
      `;
    }
  });
}
window.syncDishCartButtons = syncDishCartButtons;

/**
 * Global cart listener for buttons on any page
 */
function initGlobalCartSync() {
  window.addEventListener('cart:updated', () => {
    syncDishCartButtons();
  });
}
