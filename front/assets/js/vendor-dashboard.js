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
  Swal.fire({
    title: 'Add Product',
    html: `
      <input type="text" id="productName" class="swal2-input" placeholder="Product Name">
      <select id="productCategory" class="swal2-input" style="display: block; margin-top: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; width: 100%; box-sizing: border-box;">
        <option>Equipment</option>
        <option>Fertilizer</option>
      </select>
      <input type="number" id="productPrice" class="swal2-input" placeholder="Price (₵)" step="0.01">
      <input type="number" id="productStock" class="swal2-input" placeholder="Stock (units)" min="0">
    `,
    confirmButtonText: 'Add Product',
    showCancelButton: true,
    preConfirm: () => {
      const name = document.getElementById('productName').value;
      const category = document.getElementById('productCategory').value;
      const price = parseFloat(document.getElementById('productPrice').value);
      const stock = parseInt(document.getElementById('productStock').value);
      
      if (!name) {
        Swal.showValidationMessage('Please enter product name');
        return;
      }
      if (isNaN(price)) {
        Swal.showValidationMessage('Please enter valid price');
        return;
      }
      if (isNaN(stock)) {
        Swal.showValidationMessage('Please enter valid stock');
        return;
      }
      
      return { name, category, price, stock };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, category, price, stock } = result.value;
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
      
      Swal.fire({
        icon: 'success',
        title: 'Product Added',
        text: `${name} has been added successfully!`,
        confirmButtonColor: '#1d7c3a'
      });
    }
  });
}

// Old implementation - keeping structure
function addProductOld() {
  const name = prompt('Product Name:');
  if (!name) return;
  
  const category = prompt('Category (Equipment/Fertilizer):');
  if (!category) return;
  
  const price = parseFloat(prompt('Price (₵):'));
  if (isNaN(price)) { Swal.fire('Error', 'Invalid price', 'error'); return; }
  
  const stock = parseInt(prompt('Stock (units):'));
  if (isNaN(stock)) { Swal.fire('Error', 'Invalid stock', 'error'); return; }
  
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

// Edit product with SweetAlert
function editProduct(id) {
  const products = getAllProducts();
  const product = products.find(p => p.id === id);
  
  if (!product) return;
  
  Swal.fire({
    title: 'Edit Product',
    html: `
      <input type="text" id="editProductName" class="swal2-input" placeholder="Product Name" value="${product.name}">
      <input type="number" id="editProductPrice" class="swal2-input" placeholder="Price (₵)" value="${product.price}" step="0.01" min="0" style="margin-top: 10px;">
      <input type="number" id="editProductStock" class="swal2-input" placeholder="Stock (units)" value="${product.stock}" min="0" style="margin-top: 10px;">
    `,
    confirmButtonText: 'Update',
    confirmButtonColor: '#1d7c3a',
    cancelButtonColor: '#e74c3c',
    showCancelButton: true,
    preConfirm: () => {
      const name = document.getElementById('editProductName').value;
      const price = parseFloat(document.getElementById('editProductPrice').value);
      const stock = parseInt(document.getElementById('editProductStock').value);
      
      if (!name) {
        Swal.showValidationMessage('Please enter product name');
        return;
      }
      if (isNaN(price) || price < 0) {
        Swal.showValidationMessage('Please enter valid price');
        return;
      }
      if (isNaN(stock) || stock < 0) {
        Swal.showValidationMessage('Please enter valid stock');
        return;
      }
      
      return { name, price, stock };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { name, price, stock } = result.value;
      product.name = name;
      product.price = price;
      product.stock = stock;
      
      saveProducts(products);
      renderProductsTable();
      
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Product has been updated successfully!',
        confirmButtonColor: '#1d7c3a',
        timer: 2000,
        timerProgressBar: true
      });
    }
  });
}

// Delete product with SweetAlert
function deleteProduct(id) {
  Swal.fire({
    title: 'Delete Product?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    confirmButtonText: 'Delete',
    confirmButtonColor: '#e74c3c',
    cancelButtonColor: '#1d7c3a',
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed) {
      let products = getAllProducts();
      products = products.filter(p => p.id !== id);
      
      saveProducts(products);
      renderProductsTable();
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Product has been deleted successfully!',
        confirmButtonColor: '#1d7c3a',
        timer: 2000,
        timerProgressBar: true
      });
    }
  });
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

// View order details with SweetAlert
function viewOrderDetails(orderId) {
  const orders = getAllOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) return;
  
  Swal.fire({
    title: 'Order Details',
    html: `
      <div style="text-align: left; padding: 20px; background: rgba(29, 124, 58, 0.05); border-radius: 8px;">
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Customer:</strong> ${order.customer}</p>
        <p><strong>Items:</strong> ${order.items}</p>
        <p><strong>Amount:</strong> ₵${order.amount.toLocaleString()}</p>
        <p><strong>Date:</strong> ${order.date}</p>
        <p><strong>Status:</strong> <span style="background: rgba(29, 124, 58, 0.2); padding: 4px 8px; border-radius: 4px; color: #1d7c3a; font-weight: bold;">${order.status}</span></p>
      </div>
    `,
    confirmButtonText: 'Close',
    confirmButtonColor: '#1d7c3a',
    icon: 'info'
  });
}

// Update order status with SweetAlert
function updateOrderStatus(orderId) {
  const orders = getAllOrders();
  const order = orders.find(o => o.id === orderId);
  
  if (!order) return;
  
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  
  Swal.fire({
    title: 'Update Order Status',
    html: `
      <p style="margin-bottom: 15px;">Current Status: <strong style="color: #1d7c3a;">${order.status}</strong></p>
      <select id="newStatus" class="swal2-input" style="display: block; padding: 10px; border: 1px solid #ddd; border-radius: 4px; width: 100%; box-sizing: border-box; font-family: inherit;">
        ${statuses.map(s => `<option value="${s}" ${s === order.status ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    `,
    confirmButtonText: 'Update',
    confirmButtonColor: '#1d7c3a',
    cancelButtonColor: '#e74c3c',
    showCancelButton: true,
    preConfirm: () => {
      const newStatus = document.getElementById('newStatus').value;
      if (!newStatus) {
        Swal.showValidationMessage('Please select a status');
        return;
      }
      return newStatus;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const newStatus = result.value;
      order.status = newStatus;
      saveOrders(orders);
      renderOrdersTable();
      
      Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Order status changed to ${newStatus}!`,
        confirmButtonColor: '#1d7c3a',
        timer: 2000,
        timerProgressBar: true
      });
    }
  });
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
