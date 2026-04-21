// Vendor Dashboard Functionality

// ============================================
// PRODUCTS MANAGEMENT
// ============================================

// Initialize sample products data in localStorage
function initProductsData() {
  const existing = localStorage.getItem('vendor-products');
  if (!existing) {
    const products = [
      { id: 1, name: 'Solar Water Pump', category: 'Equipment', price: 12500, stock: 8, status: 'Active', sales: 42 },
      { id: 2, name: 'Drip Irrigation Kit', category: 'Equipment', price: 2800, stock: 24, status: 'Active', sales: 34 },
      { id: 3, name: 'Soil Testing Kit', category: 'Equipment', price: 850, stock: 15, status: 'Active', sales: 28 },
      { id: 4, name: 'Organic Fertilizer', category: 'Fertilizer', price: 450, stock: 50, status: 'Active', sales: 120 },
      { id: 5, name: 'NPK Fertilizer', category: 'Fertilizer', price: 380, stock: 60, status: 'Active', sales: 95 }
    ];
    localStorage.setItem('vendor-products', JSON.stringify(products));
  }
}

// Get all products from localStorage
function getAllProducts() {
  return JSON.parse(localStorage.getItem('vendor-products') || '[]');
}

// Save products to localStorage
function saveProducts(products) {
  localStorage.setItem('vendor-products', JSON.stringify(products));
}

// Filter and search products
function filterProducts(searchTerm = '', category = 'All Categories') {
  let products = getAllProducts();
  
  if (searchTerm) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (category !== 'All Categories') {
    products = products.filter(p => p.category === category);
  }
  
  return products;
}

// Render products table
function renderProductsTable(products = null) {
  if (!products) products = getAllProducts();
  
  const tbody = document.querySelector('.products-table tbody');
  if (!tbody) return;
  
  tbody.innerHTML = products.map(p => `
    <tr>
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>₵${p.price.toLocaleString()}</td>
      <td>${p.stock} units</td>
      <td><span class="badge badge-${p.status === 'Active' ? 'active' : 'inactive'}">${p.status}</span></td>
      <td>${p.sales}</td>
      <td>
        <button class="action-btn" onclick="editProduct(${p.id})">Edit</button>
        <button class="action-btn" style="color: #e74c3c;" onclick="deleteProduct(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Search products
function searchProducts() {
  const searchInput = document.querySelector('.search-input');
  const filterSelect = document.querySelector('.filter-select');
  
  if (!searchInput || !filterSelect) return;
  
  const searchTerm = searchInput.value;
  const category = filterSelect.value;
  
  const filtered = filterProducts(searchTerm, category);
  renderProductsTable(filtered);
}

// Setup search and filter listeners
function setupProductsSearch() {
  const searchInput = document.querySelector('.search-input');
  const filterSelect = document.querySelector('.filter-select');
  
  if (searchInput) {
    searchInput.addEventListener('input', searchProducts);
    searchInput.addEventListener('keyup', searchProducts);
  }
  
  if (filterSelect) {
    filterSelect.addEventListener('change', searchProducts);
  }
}

// Open add product modal
function addProduct() {
  const name = prompt('Product Name:');
  if (!name) return;
  
  const category = prompt('Category (Equipment/Fertilizer):');
  if (!category) return;
  
  const price = parseFloat(prompt('Price (₵):'));
  if (isNaN(price)) { alert('Invalid price'); return; }
  
  const stock = parseInt(prompt('Stock (units):'));
  if (isNaN(stock)) { alert('Invalid stock'); return; }
  
  const products = getAllProducts();
  const newId = Math.max(...products.map(p => p.id), 0) + 1;
  
  products.push({
    id: newId,
    name,
    category,
    price,
    stock,
    status: 'Active',
    sales: 0
  });
  
  saveProducts(products);
  renderProductsTable();
  alert('Product added successfully!');
}

// Edit product
function editProduct(id) {
  const products = getAllProducts();
  const product = products.find(p => p.id === id);
  
  if (!product) return;
  
  const name = prompt('Product Name:', product.name);
  if (!name) return;
  
  const price = parseFloat(prompt('Price (₵):', product.price));
  if (isNaN(price)) { alert('Invalid price'); return; }
  
  const stock = parseInt(prompt('Stock (units):', product.stock));
  if (isNaN(stock)) { alert('Invalid stock'); return; }
  
  product.name = name;
  product.price = price;
  product.stock = stock;
  
  saveProducts(products);
  renderProductsTable();
  alert('Product updated successfully!');
}

// Delete product
function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  let products = getAllProducts();
  products = products.filter(p => p.id !== id);
  
  saveProducts(products);
  renderProductsTable();
  alert('Product deleted successfully!');
}

// ============================================
// ORDERS MANAGEMENT
// ============================================

// Initialize sample orders data in localStorage
function initOrdersData() {
  const existing = localStorage.getItem('vendor-orders');
  if (!existing) {
    const orders = [
      { id: '#ORD-8247', customer: 'John Mensah', items: 'Solar Pump × 2', amount: 25000, date: 'Apr 15', status: 'Delivered' },
      { id: '#ORD-8246', customer: 'Mary Osei', items: 'Drip Kit × 1', amount: 2800, date: 'Apr 14', status: 'Shipped' },
      { id: '#ORD-8245', customer: 'Kwame Asante', items: 'Soil Kit × 3', amount: 2550, date: 'Apr 13', status: 'Processing' },
      { id: '#ORD-8244', customer: 'Ama Boateng', items: 'Fertilizer × 5', amount: 2250, date: 'Apr 12', status: 'Pending' },
      { id: '#ORD-8243', customer: 'Samuel Kojo', items: 'NPK Fertilizer × 10', amount: 3800, date: 'Apr 11', status: 'Delivered' }
    ];
    localStorage.setItem('vendor-orders', JSON.stringify(orders));
  }
}

// Get all orders from localStorage
function getAllOrders() {
  return JSON.parse(localStorage.getItem('vendor-orders') || '[]');
}

// Save orders to localStorage
function saveOrders(orders) {
  localStorage.setItem('vendor-orders', JSON.stringify(orders));
}

// Filter and search orders
function filterOrders(searchTerm = '', status = 'All Status') {
  let orders = getAllOrders();
  
  if (searchTerm) {
    orders = orders.filter(o => 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (status !== 'All Status') {
    orders = orders.filter(o => o.status === status);
  }
  
  return orders;
}

// Render orders table
function renderOrdersTable(orders = null) {
  if (!orders) orders = getAllOrders();
  
  const tbody = document.querySelector('.orders-table tbody');
  if (!tbody) return;
  
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer}</td>
      <td>${o.items}</td>
      <td>₵${o.amount.toLocaleString()}</td>
      <td>${o.date}</td>
      <td><span class="badge badge-${o.status.toLowerCase()}">${o.status}</span></td>
      <td>
        <button class="action-btn" onclick="viewOrderDetails('${o.id}')">View</button>
        <button class="action-btn" onclick="updateOrderStatus('${o.id}')">Update</button>
      </td>
    </tr>
  `).join('');
}

// Search orders
function searchOrders() {
  const searchInput = document.querySelector('.search-input');
  const filterSelect = document.querySelector('.filter-select');
  
  if (!searchInput || !filterSelect) return;
  
  const searchTerm = searchInput.value;
  const status = filterSelect.value;
  
  const filtered = filterOrders(searchTerm, status);
  renderOrdersTable(filtered);
}

// Setup search and filter listeners for orders
function setupOrdersSearch() {
  const searchInput = document.querySelector('.search-input');
  const filterSelect = document.querySelector('.filter-select');
  
  if (searchInput) {
    searchInput.addEventListener('input', searchOrders);
    searchInput.addEventListener('keyup', searchOrders);
  }
  
  if (filterSelect) {
    filterSelect.addEventListener('change', searchOrders);
  }
}

// View order details
function viewOrderDetails(orderId) {
  const orders = getAllOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) return;
  
  alert(`Order Details:\n\nOrder ID: ${order.id}\nCustomer: ${order.customer}\nItems: ${order.items}\nAmount: ₵${order.amount.toLocaleString()}\nDate: ${order.date}\nStatus: ${order.status}`);
}

// Update order status
function updateOrderStatus(orderId) {
  const orders = getAllOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) return;
  
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = statuses.indexOf(order.status);
  const newStatus = prompt(`Current Status: ${order.status}\n\nAvailable Status:\n${statuses.join('\n')}\n\nEnter new status:`);
  
  if (newStatus && statuses.includes(newStatus)) {
    order.status = newStatus;
    saveOrders(orders);
    renderOrdersTable();
    alert('Order status updated successfully!');
  } else if (newStatus) {
    alert('Invalid status. Please use one of the available options.');
  }
}

// ============================================
// PAGE INITIALIZATION
// ============================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Detect which page we're on
  const path = window.location.pathname;
  
  if (path.includes('vendor-products')) {
    initProductsData();
    renderProductsTable();
    setupProductsSearch();
  } else if (path.includes('vendor-orders')) {
    initOrdersData();
    renderOrdersTable();
    setupOrdersSearch();
  }
});
