// Data produk untuk katalog
const products = [
  { 
    id: 1, 
    name: "Tshirt Juliane Soft Black", 
    priceOld: 200000, 
    price: 100000, 
    promo: "50%", 
    stock: true, 
    sizes: ["S", "M", "L", "XL"], 
    category: "tshirt",
    img: "gambar1.jpg", 
    desc: "Regular fit, short sleeve t-shirt featuring plastisol ink screen print.<br>Material: Cotton 16s", 
    detailImgs: [
      "gambar1.jpg",
    ] 
  },
  { 
    id: 2, 
    name: "T-Shirt", 
    priceOld: 0, 
    price: 115000, 
    promo: "", 
    stock: true, 
    sizes: ["M", "L", "XL"], 
    category: "hoodie",
    img: "gambar2.jpg", 
    desc: "T-Shirt dengan bahan tebal, nyaman dipakai kapan saja.", 
    detailImgs: [
      "gambar2.jpg"
    ] 
  },
  { 
    id: 3, 
    name: "Boxy T-Shirt", 
    priceOld: 0, 
    price: 115000, 
    promo: "", 
    stock: true, 
    sizes: ["S", "M", "L", "XL"], 
    category: "crewneck",
    img: "gambar3.jpg", 
    desc: "Sweater crewneck klasik, cocok untuk gaya minimalis.", 
    detailImgs: [
      "gambar3.jpg"
    ] 
  },
  { 
    id: 4, 
    name: "Crew Neck T-Shirt", 
    priceOld: 0, 
    price: 115000, 
    promo: "", 
    stock: true, 
    sizes: ["L", "XL", "XXL"], 
    category: "tshirt",
    img: "gambar4.jpg", 
    desc: "Longsleeve simple, pas untuk gaya urban casual.", 
    detailImgs: [
      "gambar4.jpg"
    ] 
  },
  { 
    id: 5, 
    name: "Oversized T-Shirt Basic", 
    priceOld: 150000, 
    price: 120000, 
    promo: "20%", 
    stock: true, 
    sizes: ["S", "M", "L"], 
    category: "tshirt",
    img: "gambar5.jpg", 
    desc: "Oversized t-shirt dengan bahan cotton combed yang nyaman.", 
    detailImgs: [
      "gambar5.jpg"
    ] 
  },
  { 
    id: 6,
    name: "Custom T-Shirt",
    priceOld: 0,
    price: 100000,
    promo: "",
    stock: true,
    sizes: ["M", "L", "XL"],
    category: "hoodie",
    img: "gambar6.jpg",
    desc: "Hoodie dengan resleting, cocok untuk layering outfit.", 
    detailImgs: [
      "gambar6.jpg"
    ]
  }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let checkoutData = null;
let currentDetailProductId = 1;
let currentDetailSize = "";
let currentDetailQty = 1;

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Setup sidebar
  setupSidebar();
  
  // Setup navigation
  setupNavigation();
  
  // Setup event listeners
  setupEventListeners();
  
  // Render catalog
  renderCatalog();
  
  // Update cart count
  updateCartCount();
  
  // Default: tampilkan beranda
  showPage('home');
}

// Setup sidebar
function setupSidebar() {
  const menuBtn = document.getElementById('menu-btn');
  const closeSidebar = document.getElementById('close-sidebar');
  const sidebar = document.getElementById('sidebar');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  
  menuBtn.addEventListener('click', function() {
    sidebar.classList.add('active');
  });
  
  closeSidebar.addEventListener('click', function() {
    sidebar.classList.remove('active');
  });
  
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      showPage(page);
      sidebar.classList.remove('active');
    });
  });
}

// Setup navigation
function setupNavigation() {
  document.querySelectorAll('nav a').forEach(link => {
    if (!link.classList.contains('cart-icon')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(this.getAttribute('data-page'));
        document.querySelectorAll('nav a').forEach(l => l.classList.remove('nav-active'));
        this.classList.add('nav-active');
      });
    }
  });
}

// Setup event listeners
function setupEventListeners() {
  // Filter katalog
  document.getElementById('category-filter').addEventListener('change', renderCatalog);
  document.getElementById('sort-filter').addEventListener('change', renderCatalog);
  
  // Keranjang
  document.getElementById('clear-cart').addEventListener('click', clearCart);
  document.getElementById('to-checkout').addEventListener('click', function() {
    if (cart.length > 0) {
      showPage('checkout');
    } else {
      showToast('Keranjang masih kosong', 'error');
    }
  });
  
  // Modal
  document.getElementById('modal-cancel').addEventListener('click', function() {
    document.getElementById('modal').classList.remove('show');
  });
  
  // Checkout form
  document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
}

// Routing antar halaman
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(page).classList.add('active');
  
  // Update konten berdasarkan halaman
  switch(page) {
    case "catalog":
      renderCatalog();
      break;
    case "cart":
      updateCartDisplay();
      break;
    case "checkout":
      showCheckoutForm();
      break;
    case "payment":
      showPaymentInfo();
      break;
    case "product-detail":
      renderProductDetail(currentDetailProductId);
      break;
  }
  
  document.getElementById('loading').classList.remove('show');
}

// Toast notification
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `show ${type}`;
  
  setTimeout(() => {
    toast.className = '';
  }, 3000);
}

// Modal dialog
function showModal(message, onConfirm) {
  const modal = document.getElementById('modal');
  const modalMsg = document.getElementById('modal-msg');
  const modalOk = document.getElementById('modal-ok');
  
  modalMsg.textContent = message;
  modal.classList.add('show');
  
  // Remove previous event listeners
  const newOkBtn = modalOk.cloneNode(true);
  modalOk.parentNode.replaceChild(newOkBtn, modalOk);
  
  newOkBtn.addEventListener('click', function() {
    onConfirm();
    modal.classList.remove('show');
  });
}

// Render katalog produk
function renderCatalog() {
  const productList = document.getElementById('product-list');
  const categoryFilter = document.getElementById('category-filter').value;
  const sortFilter = document.getElementById('sort-filter').value;
  
  // Filter produk berdasarkan kategori
  let filteredProducts = products;
  if (categoryFilter !== 'all') {
    filteredProducts = products.filter(product => product.category === categoryFilter);
  }
  
  // Sort produk
  switch(sortFilter) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
    default:
      // Default sort by ID (asumsi ID lebih baru = produk lebih baru)
      filteredProducts.sort((a, b) => b.id - a.id);
      break;
  }
  
  // Render produk
  productList.innerHTML = '';
  
  if (filteredProducts.length === 0) {
    productList.innerHTML = '<p class="no-products">Tidak ada produk yang sesuai dengan filter.</p>';
    return;
  }
  
  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    const oldPriceHtml = product.priceOld > 0 
      ? `<span class="original-price">Rp ${product.priceOld.toLocaleString('id-ID')}</span>` 
      : '';
    
    const discountBadgeHtml = product.promo 
      ? `<span class="discount-badge">${product.promo}</span>` 
      : '';
    
    productCard.innerHTML = `
      <img src="${product.img}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">
          <span class="current-price">Rp ${product.price.toLocaleString('id-ID')}</span>
          ${oldPriceHtml}
          ${discountBadgeHtml}
        </div>
        <div class="product-actions">
          <button class="btn-small btn-add-cart" onclick="addToCart(${product.id}, '${product.sizes[0]}')">
            <i class="fas fa-shopping-cart"></i> Keranjang
          </button>
          <button class="btn-small btn-detail" onclick="goToProductDetail(${product.id})">
            Detail
          </button>
        </div>
      </div>
    `;
    
    productList.appendChild(productCard);
  });
}

// Navigasi ke detail produk
function goToProductDetail(productId) {
  currentDetailProductId = productId;
  showPage('product-detail');
}

// Render detail produk
function renderProductDetail(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  currentDetailSize = product.sizes[0];
  currentDetailQty = 1;
  
  const detailSection = document.getElementById('product-detail');
  
  const oldPriceHtml = product.priceOld > 0 
    ? `<span class="original-price">Rp ${product.priceOld.toLocaleString('id-ID')}</span>` 
    : '';
  
  const discountBadgeHtml = product.promo 
    ? `<span class="discount-badge">${product.promo}</span>` 
    : '';
  
  const sizeOptionsHtml = product.sizes.map(size => 
    `<div class="size-option ${size === currentDetailSize ? 'active' : ''}" data-size="${size}">${size}</div>`
  ).join('');
  
  const thumbnailImagesHtml = product.detailImgs.map((img, index) => 
    `<img src="${img}" alt="Thumbnail ${index + 1}" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">`
  ).join('');
  
  detailSection.innerHTML = `
    <div class="product-detail-container">
      <div class="product-gallery">
        <img src="${product.img}" alt="${product.name}" class="main-image" id="main-product-image">
        <div class="thumbnail-container">
          ${thumbnailImagesHtml}
        </div>
      </div>
      
      <div class="product-details">
        <h2>${product.name}</h2>
        
        <div class="product-meta">
          <div class="price-container">
            <span class="current-price">Rp ${product.price.toLocaleString('id-ID')}</span>
            ${oldPriceHtml}
            ${discountBadgeHtml}
          </div>
          
          <div class="stock-status">
            <i class="fas fa-check-circle"></i> ${product.stock ? 'Stok Tersedia' : 'Stok Habis'}
          </div>
        </div>
        
        <div class="size-selector">
          <label>Pilih Ukuran:</label>
          <div class="size-options">
            ${sizeOptionsHtml}
          </div>
        </div>
        
        <div class="quantity-selector">
          <label>Jumlah:</label>
          <button class="quantity-btn" onclick="updateDetailQuantity(-1)">-</button>
          <span class="quantity-display" id="detail-quantity">${currentDetailQty}</span>
          <button class="quantity-btn" onclick="updateDetailQuantity(1)">+</button>
        </div>
        
        <div class="product-actions">
          <button class="primary-btn" onclick="addToCartFromDetail()">
            <i class="fas fa-shopping-cart"></i> Tambah ke Keranjang
          </button>
          <button class="secondary-btn" onclick="buyNowFromDetail()">
            <i class="fas fa-bolt"></i> Beli Sekarang
          </button>
        </div>
        
        <div class="product-description">
          <h3>Deskripsi Produk</h3>
          <p>${product.desc.replace(/<br>/g, ' ')}</p>
          
          <div class="attention">
            <h4>Perhatian:</h4>
            <ul>
              <li>Pastikan pesanan Anda sudah sesuai sebelum menyelesaikan pembayaran</li>
              <li>Pesanan yang sudah masuk akan langsung diproses</li>
              <li>Untuk pertanyaan silakan hubungi customer service kami</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Setup event listeners untuk thumbnail
  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function() {
      const index = this.getAttribute('data-index');
      const mainImage = document.getElementById('main-product-image');
      mainImage.src = product.detailImgs[index];
      
      document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Setup event listeners untuk ukuran
  document.querySelectorAll('.size-option').forEach(option => {
    option.addEventListener('click', function() {
      currentDetailSize = this.getAttribute('data-size');
      
      document.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Update quantity di detail produk
function updateDetailQuantity(change) {
  currentDetailQty = Math.max(1, currentDetailQty + change);
  document.getElementById('detail-quantity').textContent = currentDetailQty;
}

// Tambah ke keranjang dari detail produk
function addToCartFromDetail() {
  const product = products.find(p => p.id === currentDetailProductId);
  
  for (let i = 0; i < currentDetailQty; i++) {
    addToCart(product.id, currentDetailSize);
  }
  
  showToast('Produk ditambahkan ke keranjang', 'success');
}

// Beli sekarang dari detail produk
function buyNowFromDetail() {
  addToCartFromDetail();
  showPage('cart');
}

// Keranjang belanja
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = cart.reduce((total, item) => total + item.qty, 0);
  cartCount.textContent = totalItems;
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const clearCartBtn = document.getElementById('clear-cart');
  const toCheckoutBtn = document.getElementById('to-checkout');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Keranjang belanja Anda kosong.</p>';
    cartTotal.innerHTML = '';
    clearCartBtn.style.display = 'none';
    toCheckoutBtn.style.display = 'none';
    return;
  }
  
  let tableHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Produk</th>
          <th>Ukuran</th>
          <th>Harga</th>
          <th>Jumlah</th>
          <th>Subtotal</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  let total = 0;
  
  cart.forEach(item => {
    const subtotal = item.qty * item.price;
    total += subtotal;
    
    tableHTML += `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <span>${item.name}</span>
          </div>
        </td>
        <td>${item.size}</td>
        <td>Rp ${item.price.toLocaleString('id-ID')}</td>
        <td>
          <div class="quantity-control">
            <button onclick="updateCartItemQuantity(${item.id}, '${item.size}', ${item.qty - 1})">-</button>
            <span>${item.qty}</span>
            <button onclick="updateCartItemQuantity(${item.id}, '${item.size}', ${item.qty + 1})">+</button>
          </div>
        </td>
        <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
        <td>
          <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.size}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  
  tableHTML += `
      </tbody>
    </table>
  `;
  
  cartItems.innerHTML = tableHTML;
  cartTotal.innerHTML = `
    <h3>Ringkasan Belanja</h3>
    <p>Subtotal: Rp ${total.toLocaleString('id-ID')}</p>
    <p>Ongkos Kirim: Rp 15.000</p>
    <p><strong>Total: Rp ${(total + 15000).toLocaleString('id-ID')}</strong></p>
  `;
  
  clearCartBtn.style.display = 'inline-block';
  toCheckoutBtn.style.display = 'inline-block';
  
  updateCartCount();
}

function addToCart(productId, size) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId && item.size === size);
  
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      size: size,
      qty: 1,
      image: product.img
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
  showToast('Produk ditambahkan ke keranjang', 'success');
}

function removeFromCart(productId, size) {
  showModal('Yakin ingin menghapus produk dari keranjang?', function() {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showToast('Produk dihapus dari keranjang', 'error');
  });
}

function updateCartItemQuantity(productId, size, newQty) {
  if (newQty < 1) {
    removeFromCart(productId, size);
    return;
  }
  
  const item = cart.find(item => item.id === productId && item.size === size);
  if (item) {
    item.qty = newQty;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
  }
}

function clearCart() {
  showModal('Yakin ingin mengosongkan keranjang?', function() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showToast('Keranjang dikosongkan', 'error');
  });
}

// Checkout
function showCheckoutForm() {
  if (cart.length === 0) {
    document.getElementById('checkout').innerHTML = `
      <h2>Checkout</h2>
      <p>Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.</p>
      <button class="primary-btn" onclick="showPage('catalog')">Belanja Sekarang</button>
    `;
    return;
  }
  
  // Calculate order summary
  const subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const shippingCost = 15000;
  const total = subtotal + shippingCost;
  
  let orderItemsHTML = '';
  cart.forEach(item => {
    orderItemsHTML += `
      <div class="order-item">
        <span>${item.name} (${item.size}) x${item.qty}</span>
        <span>Rp ${(item.price * item.qty).toLocaleString('id-ID')}</span>
      </div>
    `;
  });
  
  document.getElementById('order-summary').innerHTML = `
    <h3>Ringkasan Pesanan</h3>
    <div class="order-items">
      ${orderItemsHTML}
    </div>
    <div class="order-item">
      <span>Ongkos Kirim</span>
      <span>Rp ${shippingCost.toLocaleString('id-ID')}</span>
    </div>
    <div class="order-total">
      <span>Total</span>
      <span>Rp ${total.toLocaleString('id-ID')}</span>
    </div>
  `;
}

function handleCheckout(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const orderData = {
    name: formData.get('name'),
    address: formData.get('address'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    notes: formData.get('notes'),
    shipping: formData.get('shipping'),
    payment: formData.get('payment'),
    items: [...cart],
    subtotal: cart.reduce((total, item) => total + (item.price * item.qty), 0),
    shippingCost: 15000,
    total: cart.reduce((total, item) => total + (item.price * item.qty), 0) + 15000
  };
  
  checkoutData = orderData;
  
  // Simulasi proses checkout
  showLoading(true);
  setTimeout(() => {
    showLoading(false);
    showPage('payment');
  }, 1500);
}

// Payment
function showPaymentInfo() {
  const paymentInfo = document.getElementById('payment-info');
  
  if (!checkoutData) {
    paymentInfo.innerHTML = `
      <div class="payment-container">
        <p>Data checkout tidak ditemukan. Silakan lakukan checkout terlebih dahulu.</p>
        <button class="primary-btn" onclick="showPage('checkout')">Kembali ke Checkout</button>
      </div>
    `;
    return;
  }
  
  const orderId = 'DID' + Date.now();
  const paymentMethods = {
    bank: {
      name: 'Bank Transfer',
      instructions: `
        <p>Silakan transfer ke rekening berikut:</p>
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p><strong>Bank: BCA</strong></p>
          <p><strong>No. Rekening: 1234 5678 9012</strong></p>
          <p><strong>Atas Nama: DIDUNKNOWN STORE</strong></p>
        </div>
        <p>Total yang harus dibayar: <strong>Rp ${checkoutData.total.toLocaleString('id-ID')}</strong></p>
      `
    },
    ewallet: {
      name: 'E-Wallet',
      instructions: `
        <p>Silakan transfer ke e-wallet berikut:</p>
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
          <p><strong>DANA: 0812 3456 7890</strong></p>
          <p><strong>OVO: 0812 3456 7890</strong></p>
          <p><strong>GoPay: 0812 3456 7890</strong></p>
        </div>
        <p>Total yang harus dibayar: <strong>Rp ${checkoutData.total.toLocaleString('id-ID')}</strong></p>
      `
    },
    cod: {
      name: 'COD (Bayar di Tempat)',
      instructions: `
        <p>Anda memilih pembayaran saat barang diterima (COD).</p>
        <p>Total yang harus dibayar: <strong>Rp ${checkoutData.total.toLocaleString('id-ID')}</strong></p>
        <p>Pastikan Anda menyiapkan uang tunai saat kurir mengantar pesanan.</p>
      `
    }
  };
  
  const paymentMethod = paymentMethods[checkoutData.payment];
  
  paymentInfo.innerHTML = `
    <div class="payment-container">
      <div style="text-align: center; margin-bottom: 2rem;">
        <h3>Pembayaran</h3>
        <p>Nomor Pesanan: <strong>${orderId}</strong></p>
      </div>
      
      <div style="margin-bottom: 2rem;">
        <h4>Metode Pembayaran: ${paymentMethod.name}</h4>
        ${paymentMethod.instructions}
      </div>
      
      ${checkoutData.payment !== 'cod' ? `
        <div class="upload-area" id="upload-area">
          <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>Upload bukti transfer di sini</p>
          <input type="file" id="payment-proof" accept="image/*" style="display: none;">
        </div>
      ` : ''}
      
      <div style="margin-top: 2rem;">
        <button class="primary-btn" id="confirm-payment" style="width: 100%;">
          ${checkoutData.payment === 'cod' ? 'Konfirmasi Pesanan' : 'Konfirmasi Pembayaran'}
        </button>
        <button class="secondary-btn" onclick="showPage('checkout')" style="width: 100%; margin-top: 1rem;">
          Kembali ke Checkout
        </button>
      </div>
      
      <div id="payment-status" style="margin-top: 1rem;"></div>
    </div>
  `;
  
  // Setup file upload
  if (checkoutData.payment !== 'cod') {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('payment-proof');
    
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        uploadArea.innerHTML = `
          <i class="fas fa-check-circle" style="color: #388e3c; font-size: 2rem; margin-bottom: 1rem;"></i>
          <p>File terpilih: ${this.files[0].name}</p>
        `;
      }
    });
  }
  
  // Setup confirm payment button
  document.getElementById('confirm-payment').addEventListener('click', function() {
    if (checkoutData.payment !== 'cod') {
      const fileInput = document.getElementById('payment-proof');
      if (!fileInput.files || !fileInput.files[0]) {
        showToast('Silakan upload bukti transfer terlebih dahulu', 'error');
        return;
      }
    }
    
    showLoading(true);
    
    // Simulasi proses pembayaran
    setTimeout(() => {
      showLoading(false);
      
      document.getElementById('payment-status').innerHTML = `
        <div style="background: #e8f5e8; color: #388e3c; padding: 1rem; border-radius: 8px; text-align: center;">
          <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
          <h4>Pembayaran Berhasil!</h4>
          <p>Pesanan Anda sedang diproses. Kami akan mengirimkan konfirmasi via WhatsApp/Email.</p>
        </div>
      `;
      
      document.getElementById('confirm-payment').style.display = 'none';
      
      // Kosongkan keranjang
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      
      showToast('Pembayaran berhasil! Terima kasih.', 'success');
    }, 2000);
  });
}

// Loading spinner
function showLoading(show) {
  const spinner = document.getElementById('loading');
  if (show) {
    spinner.classList.add('show');
  } else {
    spinner.classList.remove('show');
  }
}

// Export functions untuk akses global
window.showPage = showPage;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.clearCart = clearCart;
window.goToProductDetail = goToProductDetail;
window.updateDetailQuantity = updateDetailQuantity;
window.addToCartFromDetail = addToCartFromDetail;
window.buyNowFromDetail = buyNowFromDetail;