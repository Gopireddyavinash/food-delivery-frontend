# CraveNest 🍔🔥 - Modern Food Delivery Frontend

> A production-grade, highly responsive food delivery web application built with **Vanilla HTML5, CSS3, and JavaScript (ES6+)**. Designed to mimic and elevate the modern UX of platforms like Swiggy and Zomato.

---

## 🌟 Live Features & Highlights

- **Swiggy/Zomato-Grade Design System**:
  - Custom brand identity with sunset orange (`#FF4F18`), rich warm coral, slate charcoal, and emerald green ratings/veg accents.
  - Glassmorphic sticky navbar with backdrop-filter blur, location picker mockup, and live cart counter with spring bounce animations.
  - Native-like **Mobile Bottom Navigation Bar** (`Home`, `Explore`, `Menu`, `Cart`, `Help`) tailored for mobile ergonomics.
  - Toast notification engine with animated progress bar for instant user feedback.

- **Multi-Page Architecture (6 Complete Pages)**:
  1. **Home (`index.html`)**:
     - Dynamic hero section with quick food search and category tags.
     - Floating live badges ("Super fast 22 min delivery", "4.8 ★ Rated Food").
     - Circular "What's on your mind?" food categories carousel with hover zoom rings.
     - Curated top restaurant chains and popular dishes with 1-click "ADD" buttons.
     - Customer reviews, value proposition pillars, and weekend promotional banner.
  2. **Restaurants Explorer (`restaurants.html`)**:
     - Live debounced search across restaurant names, cuisines, and dish keywords.
     - Multi-faceted filter toolbar: Pure Veg toggle, 4.6+ star rating filter, Fast delivery (< 20 mins), and Discounts only.
     - Horizontal cuisine filter chips (`Biryani`, `Pizzas`, `Burgers`, `North Indian`, `Pan Asian`, `Healthy`, `South Indian`, `Desserts`).
     - Dynamic sorting: Relevance, Rating (High to Low), Delivery Speed, Price (Low to High / High to Low).
     - Empty state with 1-click filter reset.
  3. **Menu & Dishes (`menu.html`)**:
     - Restaurant header with ratings, distance, delivery time, location, and promo tags.
     - Sticky category navigation tabs with smooth filtering.
     - Veg / Non-Veg diet switch.
     - Food cards with veg/non-veg dot badges, dish descriptions, and interactive quantity steppers (`[-] [qty] [+]`).
     - **Dish Detail Modal** with high-resolution view, spice level, and prep time tags.
     - Swiggy-style **Floating Bottom Cart Pill** (`X Items | ₹Total - View Cart ->`).
  4. **Cart & Checkout (`cart.html`)**:
     - 2-Column responsive checkout flow.
     - Cart items list with inline quantity steppers, item totals, and remove action.
     - Cooking instructions notes input.
     - Delivery address selector (`Home`, `Work`, `Other`).
     - Delivery partner tip chips (`₹20`, `₹30`, `₹50`, `Clear`).
     - Promo code vouchers system (`CRAVE50`, `FIRSTBITE`, `FREESHIP`, `PARTY100`) with instant validation and discount computation.
     - Itemized bill breakdown (Subtotal, Delivery Fee, Platform Fee, 5% GST, Tip, Coupon Savings, Grand Total).
     - Interactive **Checkout Modal** with payment options (UPI, Credit/Debit card, COD).
     - Celebratory **Order Success Screen** with animated checkmark, generated Order ID, and live step-by-step progress tracker.
  5. **About Us (`about.html`)**:
     - The CraveNest founding story and mission.
     - Metric counter stats (500k+ orders, 1,500+ kitchens, 22 min avg. dispatch).
     - Quality code pillars: Thermal Freshness Lock, Eco-friendly Bio packaging, Farm-to-Fork purity.
     - Culinary directors and leadership team showcase.
  6. **Contact & Customer Care (`contact.html`)**:
     - 24/7 hotline and email details with corporate headquarters address.
     - Interactive client-side validated form with field error hints and simulated ticket generation (`#TICK-XXXXX`).
     - Accordion-based **Interactive FAQs** with smooth expand/collapse and rotating chevron icons.

---

## 🛠️ Tech Stack & Architecture

- **Markup**: Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`).
- **Styling**: Vanilla CSS3 using custom CSS variables (Design Tokens), Flexbox, CSS Grid, and responsive `@media` queries.
- **Scripting**: Modern Vanilla JavaScript (ES6+ classes, pub-sub event listener pattern, local storage persistence, DOM delegation).
- **Icons**: FontAwesome 6 CDN.
- **Typography**: Google Fonts (`Plus Jakarta Sans` & `Inter`).
- **Data Persistence**: `localStorage` (`CRAVENEST_CART_V1`, `CRAVENEST_ACTIVE_COUPON`, `CRAVENEST_DELIVERY_TIP`, `CRAVENEST_LOCATION`).

---

## 📂 Project Structure

```
c:\Users\gopir\project front end/
├── index.html              # Home page
├── restaurants.html        # Restaurants exploration & multi-filter
├── menu.html               # Restaurant dishes & item detail modal
├── cart.html               # Cart, bill breakdown, and checkout flow
├── about.html              # Brand story, metrics, and quality standards
├── contact.html            # Contact form, ticket simulation & FAQs
├── css/
│   ├── style.css           # Global tokens, reset, typography, header, footer, toasts
│   ├── components.css      # Hero, cards, steppers, modals, bill breakdown, tracker
│   └── responsive.css      # Tablet & mobile media queries, bottom navigation bar
├── js/
│   ├── data.js             # Centralized mock database (restaurants, dishes, coupons, FAQs)
│   ├── cart.js             # Singleton Cart Manager with LocalStorage & event dispatcher
│   ├── main.js             # Global UI engine, sticky navbar, search, badges, card helpers
│   ├── home.js             # Home page carousels & popular dishes
│   ├── restaurants.js      # Restaurant filtering, sorting, & debounced search
│   ├── menu.js             # In-menu categories, diet toggle, modal, bottom cart bar
│   ├── cart-page.js        # Cart items rendering, tips, coupon logic, checkout simulation
│   └── contact.js          # Form validation, ticket generator, FAQ accordion
└── README.md               # Documentation & interview overview
```

---

## 🚀 How to Run Locally

You can run this project with zero build dependencies!

### Option 1: Direct File Opening
Double-click `index.html` in your file explorer to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Live Server (VS Code)
1. Open the project folder in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Python Simple HTTP Server
Open your terminal in the project directory and run:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

