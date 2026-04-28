/**
 * Search Module - Handle search functionality across The Torch application
 * Search is only available to logged-in users
 */

// API configuration
const API_BASE = 'https://thetorchbackend.vercel.app/api';

/**
 * Check if user is logged in by checking localStorage
 */
function isUserLoggedIn() {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  return token && user;
}

/**
 * Get logged-in user info
 */
function getLoggedInUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Initialize search bar visibility and handlers on page load
 */
function initializeSearchBar() {
  const searchContainer = document.getElementById('search-container');
  const globalSearch = document.getElementById('global-search');
  const searchBtn = document.getElementById('search-btn');
  const authLink = document.getElementById('auth-link');

  // Clean up incomplete auth data (token without user or vice versa)
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  if ((token && !user) || (!token && user)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
  }

  // Show search bar only if user is logged in
  if (isUserLoggedIn()) {
    if (searchContainer) searchContainer.style.display = 'flex';
    
    // Add event listeners for search
    if (globalSearch) {
      globalSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch();
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', performSearch);
    }

    // Update auth link to show logout option
    if (authLink) {
      const user = getLoggedInUser();
      if (user && user.firstName) {
        authLink.textContent = `${user.firstName} ▼`;
        authLink.href = '#';
        authLink.classList.remove('btn-login');
        authLink.classList.add('nav-link');
        authLink.onclick = (e) => {
          e.preventDefault();
          showUserMenu();
          return false;
        };
      }
    }
  } else {
    // Not logged in - hide search and reset auth link to "Sign In"
    if (searchContainer) searchContainer.style.display = 'none';
    if (authLink) {
      authLink.textContent = 'Sign In';
      authLink.href = 'pages/login.html';
      authLink.classList.add('btn-login');
      authLink.classList.remove('nav-link');
      authLink.onclick = null; // Clear any click handlers
    }
  }
}

/**
 * Show user dropdown menu
 */
function showUserMenu() {
  const existingMenu = document.getElementById('user-menu-dropdown');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }

  const authLink = document.getElementById('auth-link');
  const menu = document.createElement('div');
  menu.id = 'user-menu-dropdown';
  menu.className = 'user-menu-dropdown';
  menu.innerHTML = `
    <a href="dashboard.html" class="menu-item">Dashboard</a>
    <a href="#" class="menu-item" id="logout-btn">Logout</a>
  `;

  authLink.parentElement.style.position = 'relative';
  authLink.parentElement.appendChild(menu);

  document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#auth-link') && !e.target.closest('#user-menu-dropdown')) {
      menu.remove();
    }
  });
}

/**
 * Perform search and navigate to results page
 */
function performSearch() {
  const searchInput = document.getElementById('global-search');
  const query = searchInput ? searchInput.value.trim() : '';

  if (!query) {
    showToast('Please enter a search term', 'warning');
    return;
  }

  // Navigate to search results page with query parameter
  const searchParams = new URLSearchParams({ q: query });
  window.location.href = `search.html?${searchParams.toString()}`;
}

/**
 * Fetch search results from API
 */
async function searchProducts(query, category = '') {
  try {
    const params = new URLSearchParams({
      search: query,
      limit: 50
    });

    if (category) {
      params.append('category', category);
    }

    const response = await fetch(`${API_BASE}/products?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.products || [];
  } catch (error) {
    console.error('Search error:', error);
    showToast('Error searching products. Please try again.', 'error');
    return [];
  }
}

/**
 * Initialize search results page
 */
function initializeSearchPage() {
  // Check if user is logged in
  if (!isUserLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  // Initialize search bar
  initializeSearchBar();

  // Get search query from URL
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';

  if (query) {
    document.querySelector('#search-query-display strong').textContent = `"${query}"`;
    document.getElementById('search-input').value = query;
    performSearchAndDisplay(query);
  }

  // Setup event listeners
  const searchInput = document.getElementById('search-input');
  const refineBtn = document.getElementById('refine-search-btn');
  const categoryFilter = document.getElementById('category-filter');

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const newQuery = searchInput.value.trim();
        if (newQuery) {
          performSearchAndDisplay(newQuery);
          document.querySelector('#search-query-display strong').textContent = `"${newQuery}"`;
        }
      }
    });
  }

  if (refineBtn) {
    refineBtn.addEventListener('click', () => {
      const newQuery = searchInput.value.trim();
      if (newQuery) {
        performSearchAndDisplay(newQuery);
        document.querySelector('#search-query-display strong').textContent = `"${newQuery}"`;
      }
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      const category = categoryFilter.value;
      performSearchAndDisplay(query, category);
    });
  }
}

/**
 * Perform search and display results
 */
async function performSearchAndDisplay(query, category = '') {
  const loadingState = document.getElementById('loading-state');
  const noResultsState = document.getElementById('no-results-state');
  const resultsGrid = document.getElementById('results-grid');

  // Show loading state
  if (loadingState) loadingState.style.display = 'block';
  if (noResultsState) noResultsState.style.display = 'none';
  if (resultsGrid) resultsGrid.innerHTML = '';

  // Fetch results
  const results = await searchProducts(query, category);

  // Hide loading state
  if (loadingState) loadingState.style.display = 'none';

  // Display results or no results message
  if (results.length === 0) {
    if (noResultsState) noResultsState.style.display = 'block';
  } else {
    displaySearchResults(results);
  }
}

/**
 * Display search results in grid format
 */
function displaySearchResults(products) {
  const resultsGrid = document.getElementById('results-grid');
  
  if (!resultsGrid) return;

  resultsGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">
        <img src="../assets/images/products/${getProductImage(product.category)}" 
             alt="${product.productName}" 
             style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div class="product-body">
        <span class="product-category">${capitalizeCategory(product.category)}</span>
        <h3 class="product-name">${product.productName}</h3>
        <div class="product-price">₵${product.price.toFixed(2)}/${product.unit}</div>
        <p class="product-description">${product.description.substring(0, 100)}${product.description.length > 100 ? '...' : ''}</p>
        <div class="product-seller">
          <small>Seller: ${product.userId.firstName} ${product.userId.lastName}</small>
        </div>
        <div class="product-footer">
          <button class="btn-add-to-cart" onclick="addToCart('${product._id}', '${product.productName}', ${product.price})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Get appropriate product image based on category
 */
function getProductImage(category) {
  const imageMap = {
    produce: 'vegetables.jpg',
    vegetables: 'vegetables.jpg',
    fruits: 'fruits.jpg',
    grains: 'grains.jpeg',
    seeds: 'fresh-seeds.jpg',
    equipment: 'equipment.jpg',
    fertilizer: 'fertilizer.jpg',
    tools: 'tools.jpg'
  };
  return imageMap[category] || 'vegetables.jpg';
}

/**
 * Capitalize category name
 */
function capitalizeCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Add product to cart (localStorage)
 */
function addToCart(productId, productName, price) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productId,
      productName,
      price,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  showToast(`${productName} added to cart!`, 'success');
}

/**
 * Logout user
 */
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  showToast('Logged out successfully', 'success');
  window.location.href = 'pages/login.html';
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success', duration = 3500) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  const icons = {
    success: '✓',
    error: '!',
    warning: '!',
    info: 'i',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || 'i'}</div>
    <div class="toast-content">
      <div class="toast-message">${message}</div>
    </div>
    <button type="button" class="toast-close">&times;</button>
  `;

  container.appendChild(toast);

  const removeToast = () => {
    toast.style.animation = 'toastOut 0.22s ease-in forwards';
    setTimeout(() => toast.remove(), 220);
  };

  toast.querySelector('.toast-close').addEventListener('click', removeToast);
  setTimeout(removeToast, duration);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeSearchBar();
});
