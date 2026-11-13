/**
 * CraveNest - Restaurants Explorer Page Controller
 * Supports multi-dimensional filtering (cuisines, veg-only, ratings, delivery time, discounts),
 * instant debounced search, dynamic sorting, and URL query preservation.
 */

document.addEventListener('DOMContentLoaded', () => {
  const explorer = new RestaurantExplorer();
  explorer.init();
});

class RestaurantExplorer {
  constructor() {
    this.restaurants = CRAVENEST_DATA ? CRAVENEST_DATA.restaurants : [];
    this.state = {
      search: '',
      cuisine: 'all',
      pureVeg: false,
      rating4Plus: false,
      fastDelivery: false,
      offersOnly: false,
      sortBy: 'relevance'
    };
  }

  init() {
    this.parseQueryParams();
    this.renderCuisineChips();
    this.bindEvents();
    this.applyFilters();
  }

  /**
   * Reads URL query parameters (e.g. ?search=biryani&veg=1)
   */
  parseQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const cuisineParam = urlParams.get('cuisine');
    const vegParam = urlParams.get('veg');

    if (searchParam) {
      this.state.search = searchParam.trim();
      const searchInput = document.getElementById('restaurant-search-input');
      if (searchInput) searchInput.value = this.state.search;
    }

    if (cuisineParam) {
      this.state.cuisine = cuisineParam.toLowerCase();
    }

    if (vegParam === 'true' || vegParam === '1') {
      this.state.pureVeg = true;
      const vegBtn = document.getElementById('filter-veg');
      if (vegBtn) vegBtn.classList.add('active');
    }
  }

  /**
   * Renders cuisine filter buttons dynamically from categories
   */
  renderCuisineChips() {
    const container = document.getElementById('cuisine-filter-chips');
    if (!container || !CRAVENEST_DATA) return;

    const cuisines = [
      { id: 'all', label: 'All Cuisines' },
      { id: 'biryani', label: 'Biryani' },
      { id: 'pizza', label: 'Pizzas & Italian' },
      { id: 'burgers', label: 'Burgers' },
      { id: 'north-indian', label: 'North Indian' },
      { id: 'asian', label: 'Pan Asian' },
      { id: 'healthy', label: 'Healthy Bowls' },
      { id: 'south-indian', label: 'South Indian' },
      { id: 'desserts', label: 'Desserts' }
    ];

    container.innerHTML = cuisines.map(c => `
      <button type="button" class="cuisine-chip ${this.state.cuisine === c.id ? 'active' : ''}" data-cuisine="${c.id}">
        ${c.label}
      </button>
    `).join('');

    // Attach click events
    container.querySelectorAll('.cuisine-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        container.querySelectorAll('.cuisine-chip').forEach(btn => btn.classList.remove('active'));
        chip.classList.add('active');
        this.state.cuisine = chip.getAttribute('data-cuisine');
        this.applyFilters();
      });
    });
  }

  /**
   * Binds UI controls, search debounce, quick filter toggles, and sorting
   */
  bindEvents() {
    // Search input
    const searchInput = document.getElementById('restaurant-search-input');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.state.search = e.target.value.trim();
          this.applyFilters();
        }, 250);
      });
    }

    // Sort Dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.state.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    // Quick Filter Buttons
    this.bindFilterToggle('filter-veg', 'pureVeg');
    this.bindFilterToggle('filter-rating', 'rating4Plus');
    this.bindFilterToggle('filter-delivery', 'fastDelivery');
    this.bindFilterToggle('filter-offers', 'offersOnly');

    // Reset filters button
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetAllFilters());
    }
  }

  bindFilterToggle(elementId, stateKey) {
    const btn = document.getElementById(elementId);
    if (!btn) return;

    btn.addEventListener('click', () => {
      this.state[stateKey] = !this.state[stateKey];
      btn.classList.toggle('active', this.state[stateKey]);
      this.applyFilters();
    });
  }

  resetAllFilters() {
    this.state = {
      search: '',
      cuisine: 'all',
      pureVeg: false,
      rating4Plus: false,
      fastDelivery: false,
      offersOnly: false,
      sortBy: 'relevance'
    };

    const searchInput = document.getElementById('restaurant-search-input');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'relevance';

    document.querySelectorAll('.filter-pill-btn').forEach(btn => btn.classList.remove('active'));
    
    const chips = document.querySelectorAll('.cuisine-chip');
    chips.forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-cuisine') === 'all');
    });

    this.applyFilters();
  }

  /**
   * Applies all active filters and renders the result list
   */
  applyFilters() {
    let result = [...this.restaurants];

    // 1. Text Search Filter (Matches restaurant name, cuisines, or dishes)
    if (this.state.search) {
      const q = this.state.search.toLowerCase();
      result = result.filter(r => {
        const nameMatch = r.name.toLowerCase().includes(q);
        const cuisineMatch = r.cuisine.some(c => c.toLowerCase().includes(q));
        const locationMatch = r.location.toLowerCase().includes(q);
        // Also check if any dish under this restaurant matches
        const hasMatchingDish = CRAVENEST_DATA.dishes.some(
          d => d.restaurantId === r.id && d.name.toLowerCase().includes(q)
        );
        return nameMatch || cuisineMatch || locationMatch || hasMatchingDish;
      });
    }

    // 2. Cuisine Category Filter
    if (this.state.cuisine && this.state.cuisine !== 'all') {
      const targetCuisine = this.state.cuisine.replace('-', ' ').toLowerCase();
      result = result.filter(r => {
        return r.cuisine.some(c => c.toLowerCase().includes(targetCuisine)) ||
               CRAVENEST_DATA.dishes.some(d => d.restaurantId === r.id && d.category === this.state.cuisine);
      });
    }

    // 3. Pure Veg Filter
    if (this.state.pureVeg) {
      result = result.filter(r => r.pureVeg === true);
    }

    // 4. Rating >= 4.5 Filter
    if (this.state.rating4Plus) {
      result = result.filter(r => r.rating >= 4.6);
    }

    // 5. Fast Delivery (< 25 min) Filter
    if (this.state.fastDelivery) {
      result = result.filter(r => {
        const timeMatch = r.deliveryTime.match(/\d+/);
        return timeMatch ? parseInt(timeMatch[0], 10) <= 20 : false;
      });
    }

    // 6. Offers Only Filter
    if (this.state.offersOnly) {
      result = result.filter(r => Boolean(r.offer));
    }

    // 7. Sorting
    switch (this.state.sortBy) {
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'delivery-asc':
        result.sort((a, b) => {
          const aTime = parseInt(a.deliveryTime.match(/\d+/)?.[0] || '99', 10);
          const bTime = parseInt(b.deliveryTime.match(/\d+/)?.[0] || '99', 10);
          return aTime - bTime;
        });
        break;
      case 'cost-asc':
        result.sort((a, b) => a.numericPrice - b.numericPrice);
        break;
      case 'cost-desc':
        result.sort((a, b) => b.numericPrice - a.numericPrice);
        break;
      default:
        // Relevance: keep default curated order
        break;
    }

    this.renderResults(result);
  }

  /**
   * Renders the filtered restaurant cards or empty state
   */
  renderResults(restaurants) {
    const grid = document.getElementById('all-restaurants-grid');
    const countEl = document.getElementById('results-count-text');
    const emptyState = document.getElementById('restaurants-empty-state');

    if (!grid) return;

    if (countEl) {
      countEl.textContent = `Showing ${restaurants.length} restaurant${restaurants.length === 1 ? '' : 's'} in Bengaluru`;
    }

    if (restaurants.length === 0) {
      grid.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
    } else {
      if (emptyState) emptyState.classList.add('hidden');
      grid.innerHTML = restaurants.map(r => window.createRestaurantCardHTML(r)).join('');
    }
  }
}

