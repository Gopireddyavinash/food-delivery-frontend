/**
 * CraveNest - Centralized Mock Database
 * Contains restaurant listings, categorized food menus, promotional offers, and system data.
 * Designed for modularity, realism, and easy expansion.
 */

const CRAVENEST_DATA = {
  // Categories for the carousel and filters
  categories: [
    {
      id: "all",
      name: "All Dishes",
      icon: "fa-utensils",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80"
    },
    {
      id: "biryani",
      name: "Biryani",
      icon: "fa-bowl-rice",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80"
    },
    {
      id: "pizza",
      name: "Pizzas",
      icon: "fa-pizza-slice",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&q=80"
    },
    {
      id: "burgers",
      name: "Burgers",
      icon: "fa-burger",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80"
    },
    {
      id: "north-indian",
      name: "North Indian",
      icon: "fa-fire-burner",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&q=80"
    },
    {
      id: "asian",
      name: "Pan Asian",
      icon: "fa-bowl-food",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80"
    },
    {
      id: "healthy",
      name: "Healthy Bowls",
      icon: "fa-seedling",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80"
    },
    {
      id: "desserts",
      name: "Desserts & Shakes",
      icon: "fa-ice-cream",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=80"
    },
    {
      id: "south-indian",
      name: "South Indian",
      icon: "fa-mortar-pestle",
      image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=300&q=80"
    }
  ],

  // Restaurant partners list
  restaurants: [
    {
      id: "rest-1",
      name: "The Royal Dum Biryani",
      cuisine: ["Biryani", "Mughlai", "North Indian"],
      rating: 4.6,
      ratingCount: "3.2k+",
      deliveryTime: "25-30 min",
      distance: "2.1 km",
      priceForTwo: "₹450 for two",
      numericPrice: 450,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=700&q=80",
      featured: true,
      pureVeg: false,
      offer: "50% OFF up to ₹100",
      badge: "Bestseller",
      location: "Indiranagar, 100ft Road",
      description: "Authentic slow-cooked Awadhi and Hyderabadi dum biryanis layered with saffron, kewra, and handpicked aromatic spices."
    },
    {
      id: "rest-2",
      name: "Crust & Craft Woodfired Pizza",
      cuisine: ["Pizza", "Italian", "Pastas"],
      rating: 4.7,
      ratingCount: "2.8k+",
      deliveryTime: "20-25 min",
      distance: "1.8 km",
      priceForTwo: "₹550 for two",
      numericPrice: 550,
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=700&q=80",
      featured: true,
      pureVeg: false,
      offer: "Flat ₹125 OFF",
      badge: "Top Rated",
      location: "Koramangala 5th Block",
      description: "Artisan sourdough Neapolitan pizzas baked in a 900-degree stone oven using imported San Marzano tomatoes."
    },
    {
      id: "rest-3",
      name: "Green Herb Sattvik Kitchen",
      cuisine: ["North Indian", "Healthy", "South Indian"],
      rating: 4.8,
      ratingCount: "4.5k+",
      deliveryTime: "20-25 min",
      distance: "1.4 km",
      priceForTwo: "₹350 for two",
      numericPrice: 350,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
      featured: true,
      pureVeg: true,
      offer: "20% OFF on all combos",
      badge: "Pure Veg Choice",
      location: "HSR Layout, Sector 3",
      description: "100% Pure Vegetarian kitchen crafting guilt-free comfort meals, rich paneer gravies, and organic thalis."
    },
    {
      id: "rest-4",
      name: "The Smashed Patty Burger Co.",
      cuisine: ["Burgers", "American", "Fast Food"],
      rating: 4.5,
      ratingCount: "1.9k+",
      deliveryTime: "18-22 min",
      distance: "1.2 km",
      priceForTwo: "₹400 for two",
      numericPrice: 400,
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&q=80",
      featured: false,
      pureVeg: false,
      offer: "Free Fries with Burgers",
      badge: "Trending",
      location: "Church Street",
      description: "Crispy-edged caramelized smashed smashburgers stacked with melted sharp cheddar, brioche buns, and house secret sauce."
    },
    {
      id: "rest-5",
      name: "Wok & Dragon Pan-Asian",
      cuisine: ["Asian", "Chinese", "Dimsums"],
      rating: 4.4,
      ratingCount: "2.1k+",
      deliveryTime: "30-35 min",
      distance: "3.2 km",
      priceForTwo: "₹500 for two",
      numericPrice: 500,
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=700&q=80",
      featured: false,
      pureVeg: false,
      offer: "40% OFF up to ₹80",
      badge: "Chef Curated",
      location: "Whitefield Inner Circle",
      description: "Wok-tossed hakka noodles, steamed crystal dim sums, fiery Sichuan gravies, and comforting ramen bowls."
    },
    {
      id: "rest-6",
      name: "Dakshin Tiffin Central",
      cuisine: ["South Indian", "Breakfast", "Snacks"],
      rating: 4.9,
      ratingCount: "6.1k+",
      deliveryTime: "15-20 min",
      distance: "0.9 km",
      priceForTwo: "₹250 for two",
      numericPrice: 250,
      image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=700&q=80",
      featured: true,
      pureVeg: true,
      offer: "Free Filter Coffee over ₹299",
      badge: "Legendary",
      location: "Jayanagar 4th Block",
      description: "Crispy golden ghee roast dosas, cloud-fluffy thatte idlis, piping hot sambar, and authentic degree filter coffee."
    },
    {
      id: "rest-7",
      name: "Wholesome Salad & Smoothie Bar",
      cuisine: ["Healthy", "Salads", "Juices"],
      rating: 4.6,
      ratingCount: "1.4k+",
      deliveryTime: "20-25 min",
      distance: "2.0 km",
      priceForTwo: "₹450 for two",
      numericPrice: 450,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700&q=80",
      featured: false,
      pureVeg: true,
      offer: "Flat ₹75 OFF",
      badge: "Clean Eating",
      location: "Lavelle Road",
      description: "Nutritious macro-balanced bowls, cold-pressed cold detox juices, avocado sourdough toasts, and Greek yogurt bowls."
    },
    {
      id: "rest-8",
      name: "Sweet Cravings Pastry Studio",
      cuisine: ["Desserts", "Bakery", "Ice Creams"],
      rating: 4.8,
      ratingCount: "3.7k+",
      deliveryTime: "15-20 min",
      distance: "1.1 km",
      priceForTwo: "₹300 for two",
      numericPrice: 300,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&q=80",
      featured: true,
      pureVeg: true,
      offer: "Buy 1 Get 1 on Brownies",
      badge: "Sweet Tooth",
      location: "MG Road Boulevard",
      description: "Artisanal Belgian chocolate fudge brownies, red velvet cheesecakes, handcrafted gelato, and French macarons."
    }
  ],

  // Comprehensive Food Items database
  dishes: [
    // Biryani Category
    {
      id: "dish-101",
      name: "Hyderabadi Chicken Dum Biryani",
      restaurantId: "rest-1",
      restaurantName: "The Royal Dum Biryani",
      price: 349,
      originalPrice: 420,
      rating: 4.8,
      ratingCount: 1420,
      isVeg: false,
      category: "biryani",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80",
      description: "Tender chicken marinated overnight in fragrant spices, slow-cooked in handi with long-grain aged basmati rice. Served with spicy mirchi ka salan and cooling raita.",
      badge: "Bestseller",
      spicyLevel: "Medium",
      prepTime: "25 min"
    },
    {
      id: "dish-102",
      name: "Awadhi Royal Mutton Biryani",
      restaurantId: "rest-1",
      restaurantName: "The Royal Dum Biryani",
      price: 449,
      originalPrice: 520,
      rating: 4.9,
      ratingCount: 890,
      isVeg: false,
      category: "biryani",
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&q=80",
      description: "Succulent spring lamb simmered gently in its own juices and saffron broth, layered with caramelized onions and fresh mint.",
      badge: "Chef's Special",
      spicyLevel: "Mild",
      prepTime: "30 min"
    },
    {
      id: "dish-103",
      name: "Royal Paneer Makhani Biryani",
      restaurantId: "rest-1",
      restaurantName: "The Royal Dum Biryani",
      price: 299,
      originalPrice: 350,
      rating: 4.6,
      ratingCount: 650,
      isVeg: true,
      category: "biryani",
      image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&q=80",
      description: "Char-grilled malai paneer cubes tossed in rich makhani gravy layered with spiced dum basmati rice and roasted cashews.",
      badge: "Veg Favorite",
      spicyLevel: "Mild",
      prepTime: "20 min"
    },

    // Pizzas Category
    {
      id: "dish-201",
      name: "Margherita Basilico Woodfired Pizza",
      restaurantId: "rest-2",
      restaurantName: "Crust & Craft Woodfired Pizza",
      price: 369,
      originalPrice: 420,
      rating: 4.7,
      ratingCount: 1120,
      isVeg: true,
      category: "pizza",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80",
      description: "San Marzano tomato sauce, fresh buffalo mozzarella fior di latte, extra virgin olive oil, and fragrant organic sweet basil.",
      badge: "Authentic Classic",
      spicyLevel: "Low",
      prepTime: "20 min"
    },
    {
      id: "dish-202",
      name: "Fiery Pepperoni & Hot Honey Pizza",
      restaurantId: "rest-2",
      restaurantName: "Crust & Craft Woodfired Pizza",
      price: 499,
      originalPrice: 599,
      rating: 4.9,
      ratingCount: 940,
      isVeg: false,
      category: "pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80",
      description: "Crisped imported spicy pepperoni cups, mozzarella, pickled jalapeños, drizzled with hot chili-infused wild honey.",
      badge: "Top Rated",
      spicyLevel: "Spicy",
      prepTime: "22 min"
    },
    {
      id: "dish-203",
      name: "Truffle Mushroom & Wild Garlic Pizza",
      restaurantId: "rest-2",
      restaurantName: "Crust & Craft Woodfired Pizza",
      price: 449,
      originalPrice: 510,
      rating: 4.8,
      ratingCount: 780,
      isVeg: true,
      category: "pizza",
      image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&q=80",
      description: "Garlic cream base, roasted button and shiitake mushrooms, scamorza cheese, and white truffle oil drizzle.",
      badge: "Gourmet",
      spicyLevel: "Low",
      prepTime: "20 min"
    },

    // North Indian Category
    {
      id: "dish-301",
      name: "Shahi Paneer Lababdar",
      restaurantId: "rest-3",
      restaurantName: "Green Herb Sattvik Kitchen",
      price: 289,
      originalPrice: 340,
      rating: 4.7,
      ratingCount: 1530,
      isVeg: true,
      category: "north-indian",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80",
      description: "Fresh cottage cheese simmered in a luscious tomato-cashew gravy with bell peppers, finished with cream and kasuri methi.",
      badge: "Must Try",
      spicyLevel: "Medium",
      prepTime: "20 min"
    },
    {
      id: "dish-302",
      name: "Dal Makhani 24-Hour Slow Simmer",
      restaurantId: "rest-3",
      restaurantName: "Green Herb Sattvik Kitchen",
      price: 249,
      originalPrice: 290,
      rating: 4.9,
      ratingCount: 2100,
      isVeg: true,
      category: "north-indian",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
      description: "Whole black urad dal gently slow-cooked for 24 hours on charcoal with butter, cream, and mild handpicked spices.",
      badge: "Signature",
      spicyLevel: "Low",
      prepTime: "15 min"
    },
    {
      id: "dish-303",
      name: "Garlic Butter Naan (2 Pieces)",
      restaurantId: "rest-3",
      restaurantName: "Green Herb Sattvik Kitchen",
      price: 99,
      originalPrice: 120,
      rating: 4.6,
      ratingCount: 1850,
      isVeg: true,
      category: "north-indian",
      image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&q=80",
      description: "Clay oven baked soft leavened flatbreads brushed generously with salted garlic butter and fresh cilantro.",
      badge: "Sides",
      spicyLevel: "None",
      prepTime: "10 min"
    },

    // Burgers Category
    {
      id: "dish-401",
      name: "The Double Smashed Angus Burger",
      restaurantId: "rest-4",
      restaurantName: "The Smashed Patty Burger Co.",
      price: 329,
      originalPrice: 389,
      rating: 4.7,
      ratingCount: 1240,
      isVeg: false,
      category: "burgers",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
      description: "Twin crisp-crusted smash patties, double yellow cheddar, house dill pickles, caramelized onions, and burger sauce in toasted brioche.",
      badge: "Bestseller",
      spicyLevel: "Medium",
      prepTime: "18 min"
    },
    {
      id: "dish-402",
      name: "Crispy Peri Peri Chicken Burger",
      restaurantId: "rest-4",
      restaurantName: "The Smashed Patty Burger Co.",
      price: 279,
      originalPrice: 330,
      rating: 4.6,
      ratingCount: 980,
      isVeg: false,
      category: "burgers",
      image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&q=80",
      description: "Deep fried golden crunchy chicken breast dunked in African bird's eye chili glaze, tangy slaw, and garlic herb aioli.",
      badge: "Crispy Hit",
      spicyLevel: "Spicy",
      prepTime: "18 min"
    },
    {
      id: "dish-403",
      name: "Crunchy Truffle Veggie Burger",
      restaurantId: "rest-4",
      restaurantName: "The Smashed Patty Burger Co.",
      price: 249,
      originalPrice: 290,
      rating: 4.5,
      ratingCount: 620,
      isVeg: true,
      category: "burgers",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80",
      description: "Crispy patty made with quinoa, sweet potato, and smoked cheese, crowned with iceberg lettuce and truffle mayo.",
      badge: "Veg Special",
      spicyLevel: "Mild",
      prepTime: "15 min"
    },

    // Pan-Asian Category
    {
      id: "dish-501",
      name: "Firecracker Chili Garlic Hakka Noodles",
      restaurantId: "rest-5",
      restaurantName: "Wok & Dragon Pan-Asian",
      price: 269,
      originalPrice: 310,
      rating: 4.5,
      ratingCount: 880,
      isVeg: true,
      category: "asian",
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80",
      description: "Springy eggless noodles wok-tossed on high flame with scallions, julienned peppers, cabbage, and homemade chili paste.",
      badge: "Spicy Delight",
      spicyLevel: "Spicy",
      prepTime: "20 min"
    },
    {
      id: "dish-502",
      name: "Steamed Edamame & Truffle Dimsums (6 pcs)",
      restaurantId: "rest-5",
      restaurantName: "Wok & Dragon Pan-Asian",
      price: 320,
      originalPrice: 380,
      rating: 4.8,
      ratingCount: 710,
      isVeg: true,
      category: "asian",
      image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80",
      description: "Translucent crystal wrappers packed with crushed green edamame and water chestnuts, flavored with truffle oil. Served with spicy soy dip.",
      badge: "Fine Dining",
      spicyLevel: "Low",
      prepTime: "20 min"
    },
    {
      id: "dish-503",
      name: "Crispy Kung Pao Chicken",
      restaurantId: "rest-5",
      restaurantName: "Wok & Dragon Pan-Asian",
      price: 349,
      originalPrice: 399,
      rating: 4.6,
      ratingCount: 890,
      isVeg: false,
      category: "asian",
      image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=600&q=80",
      description: "Golden fried chicken bites tossed with dry red Sichuan chilies, crunchy roasted peanuts, and a sweet-savory garlic soy glaze.",
      badge: "Popular",
      spicyLevel: "Medium",
      prepTime: "22 min"
    },

    // South Indian Category
    {
      id: "dish-601",
      name: "Mysore Ghee Masala Dosa",
      restaurantId: "rest-6",
      restaurantName: "Dakshin Tiffin Central",
      price: 140,
      originalPrice: 170,
      rating: 4.9,
      ratingCount: 3400,
      isVeg: true,
      category: "south-indian",
      image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&q=80",
      description: "Crispy crepe roasted in pure desi ghee, smeared with spicy red garlic chutney, stuffed with spiced potato masala. Accompanied by 3 signature chutneys.",
      badge: "Legendary",
      spicyLevel: "Medium",
      prepTime: "15 min"
    },
    {
      id: "dish-602",
      name: "Ghee Podi Thatte Idli (2 Pcs)",
      restaurantId: "rest-6",
      restaurantName: "Dakshin Tiffin Central",
      price: 110,
      originalPrice: 130,
      rating: 4.8,
      ratingCount: 2200,
      isVeg: true,
      category: "south-indian",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80",
      description: "Plump, melt-in-mouth steamed rice cakes slathered in spicy gun powder (podi) and sizzling pure ghee. Served with hot lentil sambar.",
      badge: "Must Try",
      spicyLevel: "Medium",
      prepTime: "10 min"
    },
    {
      id: "dish-603",
      name: "Authentic Degree Filter Coffee",
      restaurantId: "rest-6",
      restaurantName: "Dakshin Tiffin Central",
      price: 60,
      originalPrice: 75,
      rating: 4.9,
      ratingCount: 4200,
      isVeg: true,
      category: "south-indian",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80",
      description: "Traditional chicory-blended dark roast decoction frothed high with creamy whole milk in brass davarah and tumbler.",
      badge: "Bestseller",
      spicyLevel: "None",
      prepTime: "5 min"
    },

    // Healthy Category
    {
      id: "dish-701",
      name: "Mediterranean Grilled Paneer Quinoa Bowl",
      restaurantId: "rest-7",
      restaurantName: "Wholesome Salad & Smoothie Bar",
      price: 310,
      originalPrice: 360,
      rating: 4.7,
      ratingCount: 760,
      isVeg: true,
      category: "healthy",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
      description: "Herb-marinated paneer skewers, organic tri-color quinoa, roasted chickpea crunch, kalamata olives, cherry tomatoes, and lemon tahini dressing.",
      badge: "High Protein",
      spicyLevel: "Low",
      prepTime: "15 min"
    },
    {
      id: "dish-702",
      name: "Avocado, Walnut & Cranberry Super Bowl",
      restaurantId: "rest-7",
      restaurantName: "Wholesome Salad & Smoothie Bar",
      price: 360,
      originalPrice: 420,
      rating: 4.8,
      ratingCount: 680,
      isVeg: true,
      category: "healthy",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
      description: "Ripe Hass avocado slices, crisp baby spinach, toasted Californian walnuts, dried cranberries, feta cheese, and white balsamic reduction.",
      badge: "Nutrient Rich",
      spicyLevel: "None",
      prepTime: "12 min"
    },

    // Desserts Category
    {
      id: "dish-801",
      name: "Belgian Molten Chocolate Lava Cake",
      restaurantId: "rest-8",
      restaurantName: "Sweet Cravings Pastry Studio",
      price: 199,
      originalPrice: 249,
      rating: 4.9,
      ratingCount: 2300,
      isVeg: true,
      category: "desserts",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
      description: "Warm individual chocolate sponge cake with a decadent flow of melted 70% dark Belgian chocolate inside. Pure ecstasy in every spoonful.",
      badge: "Heavenly",
      spicyLevel: "None",
      prepTime: "15 min"
    },
    {
      id: "dish-802",
      name: "New York Classic Baked Cheesecake",
      restaurantId: "rest-8",
      restaurantName: "Sweet Cravings Pastry Studio",
      price: 239,
      originalPrice: 280,
      rating: 4.8,
      ratingCount: 1650,
      isVeg: true,
      category: "desserts",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80",
      description: "Dense, velvety Philadelphia cream cheese filling on a crumbly cinnamon graham cracker crust, crowned with fresh blueberry compote.",
      badge: "Chef Choice",
      spicyLevel: "None",
      prepTime: "10 min"
    },
    {
      id: "dish-803",
      name: "Nutella Hazelnut Loaded Waffle",
      restaurantId: "rest-8",
      restaurantName: "Sweet Cravings Pastry Studio",
      price: 219,
      originalPrice: 260,
      rating: 4.7,
      ratingCount: 1890,
      isVeg: true,
      category: "desserts",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
      description: "Crispy golden Belgian waffle drenched in warm Nutella sauce, toasted crunchy hazelnuts, chocolate curls, and dusted sugar.",
      badge: "Bestseller",
      spicyLevel: "None",
      prepTime: "15 min"
    }
  ],

  // Promo code vouchers
  coupons: [
    {
      code: "CRAVE50",
      discountPercent: 50,
      maxDiscount: 100,
      minOrder: 199,
      description: "50% OFF up to ₹100 on orders above ₹199"
    },
    {
      code: "FIRSTBITE",
      discountPercent: 30,
      maxDiscount: 150,
      minOrder: 299,
      description: "Flat 30% OFF up to ₹150 for your inaugural order"
    },
    {
      code: "FREESHIP",
      freeDelivery: true,
      minOrder: 249,
      description: "Free Instant Delivery on orders above ₹249"
    },
    {
      code: "PARTY100",
      flatDiscount: 100,
      minOrder: 499,
      description: "Flat ₹100 OFF on group orders above ₹499"
    }
  ],

  // Platform financial calculation constants
  pricing: {
    deliveryBaseFee: 40,
    deliveryFreeThreshold: 499,
    platformFee: 7,
    gstRate: 0.05 // 5% GST
  },

  // Frequently Asked Questions for Contact & Support page
  faqs: [
    {
      question: "How does CraveNest ensure 30-minute delivery?",
      answer: "We partner with local kitchens within your geographic radius and employ smart AI dispatch algorithms that assign drivers the moment food preparation starts, ensuring blazing fast delivery times."
    },
    {
      question: "What happens if an item is missing or damaged?",
      answer: "We offer an instant No-Questions-Asked refund or replacement policy. Simply head to the Contact page or live chat within 2 hours of delivery with a quick photo of your receipt."
    },
    {
      question: "Are there any hidden fees or extra surcharges?",
      answer: "None! All charges—including the nominal ₹7 platform fee, 5% standard GST, and delivery charges (free on orders above ₹499)—are crystal clear and itemized before you confirm payment."
    },
    {
      question: "Can I customize dietary preferences (Jain, Vegan, Gluten-Free)?",
      answer: "Absolutely. Each restaurant provides live cooking instructions fields in your cart where you can mention 'Less spicy', 'No onions/garlic', or 'Extra cutlery'."
    },
    {
      question: "What payment options are supported?",
      answer: "We support UPI (Google Pay, PhonePe, Paytm), Credit/Debit cards (Visa, MasterCard, RuPay), Net Banking across 50+ banks, and Cash/UPI on Delivery."
    }
  ],

  // Testimonials for Home & About
  testimonials: [
    {
      name: "Ananya Deshmukh",
      role: "Product Designer, Bengaluru",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
      comment: "CraveNest has redefined dinner time for me. The woodfired pizzas arrive bubbling hot, and the live order tracker is impeccably accurate!"
    },
    {
      name: "Rohit Mathur",
      role: "Tech Lead, HSR Layout",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      comment: "The filter for pure veg kitchens is super handy. Dum biryani from The Royal Biryani tasted like an authentic five-star feast at home."
    },
    {
      name: "Pooja Hegde",
      role: "Fitness Coach",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
      comment: "Finally an app that takes healthy bowls seriously! The macro counts and fresh ingredients make it my daily lunch companion."
    }
  ]
};

// Global accessor helper for other modules
window.CRAVENEST_DATA = CRAVENEST_DATA;

