/**
 * CraveNest - Restaurant & Menu Page Controller
 * Displays restaurant headers, category navigation tabs, veg/non-veg filter toggle,
 * in-menu dish search, dish modal, and floating bottom cart bar.
 */

document.addEventListener('DOMContentLoaded', () => {
  const menuController = new MenuController();
  menuController.init();
});

class MenuController {
  constructor() {
    this.currentRestaurant = null;
    this.activeCategory = 'all';
    this.dietFilter = 'all'; // 'all' | 'veg' | 'nonveg'
    this.dishSearchQuery = '';
  }

  init() {
    this.parseURL();
    this.renderRestaurantHeader();
    this.renderCategoryNav();
    this.bindEvents();
    this.renderDishes();
    this.updateBottomCartBar();

    // Listen for cart changes
    window.addEventListener('cart:updated', () => {
      this.syncSteppers();
      this.updateBottomCartBar();
    });
  }

  parseURL() {
    const params = new URLSearchParams(window.location.search);
    const restId = params.get('id');
    const categoryParam = params.get('category');

    if (restId) {
      this.currentRestaurant = CRAVENEST_DATA.restaurants.find(r => r.id === restId);
    }

    if (categoryParam) {
      this.activeCategory = categoryParam;
    }

    // If no restaurant matched and no category passed, default to flagship restaurant
    if (!this.currentRestaurant && !categoryParam) {
      this.currentRestaurant = CRAVENEST_DATA.restaurants[0];
    }
  }

  renderRestaurantHeader() {
    const bannerContainer = document.getElementById('restaurant-hero-banner');
    if (!bannerContainer) return;

    if (this.currentRestaurant) {
      const r = this.currentRestaurant;
      bannerContainer.innerHTML = `
        <div class="rest-banner-card">
          <div class="rest-banner-content">
            <nav class="breadcrumb-nav">
              <a href="index.html">Home</a> &rsaquo; 
              <a href="restaurants.html">Restaurants</a> &rsaquo; 
              <span>${r.name}</span>
            </nav>
            <h1 class="rest-banner-title">${r.name}</h1>
            <p class="rest-banner-cuisines">${r.cuisine.join(' &bull; ')}</p>
            <p class="rest-banner-desc">${r.description}</p>
            <div class="rest-banner-meta">
              <div class="meta-pill rating-pill"><i class="fa-solid fa-star"></i> ${r.rating} (${r.ratingCount})</div>
              <div class="meta-pill"><i class="fa-solid fa-clock"></i> ${r.deliveryTime}</div>
              <div class="meta-pill"><i class="fa-solid fa-indian-rupee-sign"></i> ${r.priceForTwo}</div>
              <div class="meta-pill"><i class="fa-solid fa-location-dot"></i> ${r.location}</div>
            </div>
          </div>
          <div class="rest-banner-media">
            <img src="${r.image}" alt="${r.name}" class="rest-hero-img" />
            ${r.offer ? `
              <div class="rest-banner-offer-badge">
                <i class="fa-solid fa-tags"></i>
                <span>${r.offer}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    } else {
      // General explore category header
      const catObj = CRAVENEST_DATA.categories.find(c => c.id === this.activeCategory);
      const catTitle = catObj ? catObj.name : 'Handcrafted Culinary Delights';
      bannerContainer.innerHTML = `
        <div class="rest-banner-card general-category-banner">
          <div class="rest-banner-content">
            <nav class="breadcrumb-nav">
              <a href="index.html">Home</a> &rsaquo; 
              <span>Menu Collection</span>
            </nav>
            <h1 class="rest-banner-title">${catTitle}</h1>
            <p class="rest-banner-cuisines">Explore chef-crafted recipes delivered hot to your doorstep</p>
          </div>
        </div>
      `;
    }
  }

  renderCategoryNav() {
    const nav = document.getElementById('menu-category-nav');
    if (!nav || !CRAVENEST_DATA) return;

    let availableCategories = [{ id: 'all', name: 'All Dishes' }];
    CRAVENEST_DATA.categories.forEach(c => {
      if (c.id !== 'all') {
        availableCategories.push(c);
      }
    });

    nav.innerHTML = availableCategories.map(cat => `
      <button type="button" class="menu-cat-tab ${this.activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
        ${cat.name}
      </button>
    `).join('');

    nav.querySelectorAll('.menu-cat-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        nav.querySelectorAll('.menu-cat-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-cat');
        this.renderDishes();
      });
    });
  }

  bindEvents() {
    // Diet Switch (All, Veg, Non-Veg)
    const dietToggles = document.querySelectorAll('.diet-filter-btn');
    dietToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        dietToggles.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.dietFilter = btn.getAttribute('data-diet');
        this.renderDishes();
      });
    });

    // In-Menu Search
    const searchInput = document.getElementById('menu-dish-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.dishSearchQuery = e.target.value.trim().toLowerCase();
        this.renderDishes();
      });
    }

    // Dish Click for Detail Modal & Add to Cart Delegation
    const dishesGrid = document.getElementById('menu-dishes-grid');
    if (dishesGrid) {
      dishesGrid.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.btn-add-food');
        const incBtn = e.target.closest('.btn-inc');
        const decBtn = e.target.closest('.btn-dec');
        const cardMedia = e.target.closest('.food-card-img-box, .food-title');

        if (addBtn) {
          const dishId = addBtn.getAttribute('data-id');
          window.cartManager.addItem(dishId, 1);
        } else if (incBtn) {
          const dishId = incBtn.getAttribute('data-id');
          window.cartManager.incrementItem(dishId);
        } else if (decBtn) {
          const dishId = decBtn.getAttribute('data-id');
          window.cartManager.decrementItem(dishId);
        } else if (cardMedia) {
          const card = cardMedia.closest('.food-card');
          const dishId = card.getAttribute('data-id');
          this.openDishModal(dishId);
        }
      });
    }
  }

  getFilteredDishes() {
    let list = [...CRAVENEST_DATA.dishes];

    // Category filter logic
    if (this.activeCategory !== 'all') {
      if (this.currentRestaurant) {
        const restMatches = list.filter(d => d.restaurantId === this.currentRestaurant.id && d.category === this.activeCategory);
        if (restMatches.length > 0) {
          list = restMatches;
        } else {
          // If current restaurant doesn't have that category, fall back to matching dishes
          list = list.filter(d => d.category === this.activeCategory);
        }
      } else {
        list = list.filter(d => d.category === this.activeCategory);
      }
    } else if (this.currentRestaurant) {
      // Show this restaurant's dishes + recommend related dishes
      const restDishes = list.filter(d => d.restaurantId === this.currentRestaurant.id);
      if (restDishes.length > 0) {
        list = restDishes;
      }
    }

    // Diet filter
    if (this.dietFilter === 'veg') {
      list = list.filter(d => d.isVeg === true);
    } else if (this.dietFilter === 'nonveg') {
      list = list.filter(d => d.isVeg === false);
    }

    // Search query
    if (this.dishSearchQuery) {
      list = list.filter(d =>
        d.name.toLowerCase().includes(this.dishSearchQuery) ||
        d.description.toLowerCase().includes(this.dishSearchQuery) ||
        (d.badge && d.badge.toLowerCase().includes(this.dishSearchQuery))
      );
    }

    return list;
  }

  renderDishes() {
    const grid = document.getElementById('menu-dishes-grid');
    const emptyState = document.getElementById('menu-empty-state');
    const countEl = document.getElementById('menu-items-count');

    if (!grid) return;

    const dishes = this.getFilteredDishes();

    if (countEl) {
      countEl.textContent = `${dishes.length} Item${dishes.length === 1 ? '' : 's'}`;
    }

    if (dishes.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      grid.innerHTML = dishes.map(d => window.createFoodCardHTML(d)).join('');
    }
  }

  syncSteppers() {
    if (window.syncDishCartButtons) {
      window.syncDishCartButtons();
    }
  }

  updateBottomCartBar() {
    const bar = document.getElementById('floating-cart-bar');
    if (!bar || !window.cartManager) return;

    const calculations = window.cartManager.getCalculations();
    const count = window.cartManager.getTotalCount();

    if (count > 0) {
      bar.classList.remove('hidden');
      bar.innerHTML = `
        <div class="floating-cart-inner">
          <div class="floating-cart-info">
            <span class="floating-cart-qty">${count} item${count > 1 ? 's' : ''} added</span>
            <span class="floating-cart-divider">|</span>
            <span class="floating-cart-total">₹${calculations.grandTotal}</span>
          </div>
          <a href="cart.html" class="floating-cart-btn">
            View Cart <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      `;
    } else {
      bar.classList.add('hidden');
    }
  }

  openDishModal(dishId) {
    const dish = CRAVENEST_DATA.dishes.find(d => d.id === dishId);
    if (!dish) return;

    let modal = document.getElementById('dish-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dish-detail-modal';
      modal.className = 'modal-wrapper';
      document.body.appendChild(modal);
    }

    const cartItem = window.cartManager ? window.cartManager.getItem(dish.id) : null;
    const qty = cartItem ? cartItem.quantity : 0;

    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-dialog modal-dish-dialog">
        <button type="button" class="modal-close-icon" aria-label="Close dialog">&times;</button>
        <div class="modal-dish-content">
          <div class="modal-dish-image-wrap">
            <img src="${dish.image}" alt="${dish.name}" />
            <span class="food-diet-badge ${dish.isVeg ? 'diet-veg' : 'diet-nonveg'}">
              <span class="diet-dot"></span>
            </span>
          </div>
          <div class="modal-dish-info">
            <div class="modal-dish-header">
              <h2 class="modal-dish-title">${dish.name}</h2>
              <span class="rating-badge rating-high"><i class="fa-solid fa-star"></i> ${dish.rating}</span>
            </div>
            <p class="modal-dish-restaurant"><i class="fa-solid fa-store"></i> ${dish.restaurantName}</p>
            <p class="modal-dish-desc">${dish.description}</p>
            
            <div class="dish-spec-tags">
              <span class="spec-tag"><i class="fa-solid fa-fire"></i> Spice: ${dish.spicyLevel || 'Mild'}</span>
              <span class="spec-tag"><i class="fa-solid fa-clock"></i> Prep: ${dish.prepTime || '20 min'}</span>
              ${dish.badge ? `<span class="spec-tag tag-highlight"><i class="fa-solid fa-award"></i> ${dish.badge}</span>` : ''}
            </div>

            <div class="modal-dish-footer">
              <div class="modal-price-wrap">
                <span class="modal-price">₹${dish.price}</span>
                ${dish.originalPrice ? `<span class="modal-original-price">₹${dish.originalPrice}</span>` : ''}
              </div>
              <div class="food-action-box" data-dish-id="${dish.id}">
                ${qty > 0 ? `
                  <div class="qty-stepper">
                    <button type="button" class="stepper-btn btn-dec" data-id="${dish.id}">-</button>
                    <span class="stepper-count">${qty}</span>
                    <button type="button" class="stepper-btn btn-inc" data-id="${dish.id}">+</button>
                  </div>
                ` : `
                  <button type="button" class="btn-add-food btn-modal-add" data-id="${dish.id}">
                    ADD TO CART <i class="fa-solid fa-bag-shopping"></i>
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');

    const closeModal = () => modal.classList.remove('open');
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    modal.querySelector('.modal-close-icon').addEventListener('click', closeModal);

    modal.querySelector('.modal-dish-footer').addEventListener('click', (e) => {
      const addBtn = e.target.closest('.btn-add-food');
      const incBtn = e.target.closest('.btn-inc');
      const decBtn = e.target.closest('.btn-dec');

      if (addBtn) {
        window.cartManager.addItem(dish.id, 1);
        this.openDishModal(dish.id);
      } else if (incBtn) {
        window.cartManager.incrementItem(dish.id);
        this.openDishModal(dish.id);
      } else if (decBtn) {
        window.cartManager.decrementItem(dish.id);
        this.openDishModal(dish.id);
      }
    });
  }
}
