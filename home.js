/**
 * CraveNest - Home Page Controller
 * Handles category carousel rendering, featured restaurants, popular dishes,
 * direct add-to-cart interactions, and hero search.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryCarousel();
  renderFeaturedRestaurants();
  renderPopularDishes();
  renderTestimonials();
  initHeroSearch();
});

/**
 * Renders circular "What's on your mind?" food category cards
 */
function renderCategoryCarousel() {
  const container = document.getElementById('categories-container');
  if (!container || !window.CRAVENEST_DATA) return;

  const categories = CRAVENEST_DATA.categories;
  container.innerHTML = categories.map(cat => `
    <a href="menu.html?category=${cat.id}" class="category-circle-card" data-category="${cat.id}">
      <div class="category-img-wrap">
        <img src="${cat.image}" alt="${cat.name}" loading="lazy" />
      </div>
      <span class="category-name">${cat.name}</span>
    </a>
  `).join('');
}

/**
 * Renders Top Featured Restaurant Cards on the Home Page
 */
function renderFeaturedRestaurants() {
  const container = document.getElementById('featured-restaurants-grid');
  if (!container || !window.CRAVENEST_DATA) return;

  const featured = CRAVENEST_DATA.restaurants.filter(r => r.featured).slice(0, 6);
  container.innerHTML = featured.map(window.createRestaurantCardHTML).join('');
}

/**
 * Renders Popular Dishes with Instant Add-to-Cart Steppers
 */
function renderPopularDishes() {
  const container = document.getElementById('popular-dishes-grid');
  if (!container || !window.CRAVENEST_DATA) return;

  const dishes = CRAVENEST_DATA.dishes.filter(d => d.rating >= 4.7).slice(0, 8);
  container.innerHTML = dishes.map(window.createFoodCardHTML).join('');
  attachDishEventListeners(container);
}

/**
 * Attaches event listeners to Add and Stepper buttons
 */
function attachDishEventListeners(container) {
  if (!container) return;

  container.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-food');
    const incBtn = e.target.closest('.btn-inc');
    const decBtn = e.target.closest('.btn-dec');

    if (addBtn) {
      const dishId = addBtn.getAttribute('data-id');
      if (window.cartManager) {
        window.cartManager.addItem(dishId, 1);
      }
    } else if (incBtn) {
      const dishId = incBtn.getAttribute('data-id');
      if (window.cartManager) {
        window.cartManager.incrementItem(dishId);
      }
    } else if (decBtn) {
      const dishId = decBtn.getAttribute('data-id');
      if (window.cartManager) {
        window.cartManager.decrementItem(dishId);
      }
    }
  });
}

/**
 * Renders Testimonials
 */
function renderTestimonials() {
  const container = document.getElementById('testimonials-grid');
  if (!container || !window.CRAVENEST_DATA) return;

  container.innerHTML = CRAVENEST_DATA.testimonials.map(item => `
    <div class="testimonial-card" style="background: #FFFFFF; border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);">
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 12px;">
        <img src="${item.avatar}" alt="${item.name}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" loading="lazy" />
        <div>
          <h4 style="font-size: 1rem; font-weight: 800;">${item.name}</h4>
          <p style="font-size: 0.8rem; color: var(--text-muted);">${item.role}</p>
        </div>
      </div>
      <div style="color: var(--accent-gold); font-size: 0.85rem; margin-bottom: 10px;">
        ${Array(item.rating).fill('<i class="fa-solid fa-star"></i>').join('')}
      </div>
      <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; font-style: italic;">"${item.comment}"</p>
    </div>
  `).join('');
}

/**
 * Hero Search interaction
 */
function initHeroSearch() {
  const heroForm = document.getElementById('hero-search-form');
  if (!heroForm) return;

  heroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = heroForm.querySelector('input');
    if (input && input.value.trim()) {
      window.location.href = `restaurants.html?search=${encodeURIComponent(input.value.trim())}`;
    }
  });
}
