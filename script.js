// ===== FOOD DATA =====
const foods = [
  { id: 1, name: "Chicken Biryani", desc: "Fragrant basmati rice layered with spiced chicken, saffron and caramelised onions.", price: 249, rating: 4.8, time: "30 min", category: "Indian", veg: false, best: true, img: "images/biryani.png" },
  { id: 2, name: "Gourmet Burger", desc: "Double beef patty with melted cheddar, fresh lettuce, tomato and secret sauce.", price: 199, rating: 4.6, time: "20 min", category: "Fast Food", veg: false, best: false, img: "images/burger.png" },
  { id: 3, name: "Margherita Pizza", desc: "Wood-fired pizza with fresh mozzarella, basil and San Marzano tomato sauce.", price: 299, rating: 4.7, time: "25 min", category: "Italian", veg: true, best: true, img: "images/pizza.png" },
  { id: 4, name: "Butter Chicken", desc: "Tender chicken in a rich, velvety tomato-cream sauce with aromatic spices.", price: 279, rating: 4.9, time: "30 min", category: "Indian", veg: false, best: true, img: "images/butter_chicken.png" },
  { id: 5, name: "Sushi Platter", desc: "Fresh salmon rolls, tuna nigiri and California rolls with wasabi and soy sauce.", price: 449, rating: 4.7, time: "35 min", category: "Japanese", veg: false, best: false, img: "images/sushi.png" },
  { id: 6, name: "Chocolate Lava Cake", desc: "Warm chocolate cake with molten centre, served with vanilla ice cream and berries.", price: 179, rating: 4.8, time: "15 min", category: "Desserts", veg: true, best: true, img: "images/chocolate_cake.png" },
  { id: 7, name: "Mango Lassi & Mocktails", desc: "Chilled mango lassi, strawberry smoothie and fresh mint mojito combo.", price: 149, rating: 4.5, time: "10 min", category: "Drinks", veg: true, best: false, img: "images/drinks.png" },
  { id: 8, name: "Masala Dosa", desc: "Crispy golden dosa stuffed with spiced potato filling, served with coconut chutney and sambar.", price: 129, rating: 4.6, time: "20 min", category: "Indian", veg: true, best: false, img: "images/dosa.png" },
  { id: 9, name: "Spicy Pepperoni Pasta", desc: "Pasta in rich tomato sauce with pepperoni, fresh basil and parmesan, served with garlic bread.", price: 259, rating: 4.5, time: "25 min", category: "Italian", veg: false, best: false, img: "images/pasta.png" }
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('foodiees_cart') || '[]');
let currentFilter = '';
let currentSearch = '';
let currentSort = '';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderFoodGrid(foods);
  updateCartBadge();
  window.addEventListener('scroll', handleScroll);
});

// ===== NAVBAR SCROLL =====
function handleScroll() {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}

// ===== PAGE SWITCHING =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(page + '-page').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'cart') renderCart();
  // Update nav active state
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  if (page === 'home') document.getElementById('nav-home').classList.add('active');
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ===== SCROLL HELPERS =====
function scrollToMenu() {
  showPage('home');
  setTimeout(() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' }), 100);
}
function scrollToOffers() {
  showPage('home');
  setTimeout(() => document.getElementById('offers').scrollIntoView({ behavior: 'smooth' }), 100);
}
function scrollToFooter() {
  showPage('home');
  setTimeout(() => document.getElementById('footer').scrollIntoView({ behavior: 'smooth' }), 100);
}

// ===== RENDER FOOD GRID =====
function renderFoodGrid(items) {
  const grid = document.getElementById('food-grid');
  const noResults = document.getElementById('no-results');
  grid.innerHTML = '';

  if (items.length === 0) {
    noResults.style.display = 'block';
    return;
  }
  noResults.style.display = 'none';

  items.forEach((food, i) => {
    const inCart = getCartItem(food.id);
    const qty = inCart ? inCart.qty : 0;
    const card = document.createElement('div');
    card.className = 'food-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="food-card-img">
        <img src="${food.img}" alt="${food.name}" loading="lazy" />
        <span class="veg-badge ${food.veg ? 'veg' : 'non-veg'}">${food.veg ? '🟢 VEG' : '🔴 NON-VEG'}</span>
        ${food.best ? '<span class="best-seller">🏅 BESTSELLER</span>' : ''}
      </div>
      <div class="food-card-body">
        <div class="food-name">${food.name}</div>
        <div class="food-desc">${food.desc}</div>
        <div class="food-meta">
          <span class="food-rating">⭐ ${food.rating}</span>
          <span class="food-time">🕐 ${food.time}</span>
        </div>
        <div class="food-footer">
          <span class="food-price">₹${food.price}</span>
          <div id="food-ctrl-${food.id}">
            ${qty === 0
              ? `<button class="add-btn" onclick="addToCart(${food.id})">+ Add</button>`
              : `<div class="qty-control">
                   <button class="qty-btn" onclick="changeQty(${food.id}, -1)">−</button>
                   <span class="qty-num" id="qty-${food.id}">${qty}</span>
                   <button class="qty-btn" onclick="changeQty(${food.id}, 1)">+</button>
                 </div>`
            }
          </div>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

// ===== FILTER & SEARCH =====
function filterByCategory(cat) {
  currentFilter = cat;
  // Highlight active category card
  document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
  if (cat === '') {
    document.getElementById('cat-all').classList.add('active');
  } else {
    const map = { 'Indian':'cat-indian','Fast Food':'cat-fastfood','Italian':'cat-italian','Japanese':'cat-japanese','Desserts':'cat-desserts','Drinks':'cat-drinks' };
    if (map[cat]) document.getElementById(map[cat]).classList.add('active');
  }
  // Show/hide filter tag
  const filterEl = document.getElementById('active-filter');
  if (cat) {
    document.getElementById('filter-label').textContent = cat;
    filterEl.style.display = 'flex';
  } else {
    filterEl.style.display = 'none';
  }
  applyFilters();
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

function filterFood(val) {
  currentSearch = val.toLowerCase();
  applyFilters();
}

function applyFilters() {
  let result = [...foods];
  if (currentFilter) result = result.filter(f => f.category === currentFilter);
  if (currentSearch) result = result.filter(f =>
    f.name.toLowerCase().includes(currentSearch) ||
    f.desc.toLowerCase().includes(currentSearch) ||
    f.category.toLowerCase().includes(currentSearch)
  );
  if (currentSort === 'price-asc') result.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-desc') result.sort((a, b) => b.price - a.price);
  else if (currentSort === 'rating') result.sort((a, b) => b.rating - a.rating);
  renderFoodGrid(result);
}

function sortFood(val) {
  currentSort = val;
  applyFilters();
}

// ===== CART OPERATIONS =====
function getCartItem(id) {
  return cart.find(c => c.id === id);
}

function saveCart() {
  localStorage.setItem('foodiees_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  document.getElementById('cart-badge').textContent = total;
}

function addToCart(id) {
  const food = foods.find(f => f.id === id);
  if (!food) return;
  const existing = getCartItem(id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...food, qty: 1 });
  }
  saveCart();
  updateFoodControl(id);
  showToast(`${food.name} added to cart 🛒`);
}

function changeQty(id, delta) {
  const item = getCartItem(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  saveCart();
  updateFoodControl(id);
}

function updateFoodControl(id) {
  const ctrl = document.getElementById(`food-ctrl-${id}`);
  if (!ctrl) return;
  const item = getCartItem(id);
  const qty = item ? item.qty : 0;
  ctrl.innerHTML = qty === 0
    ? `<button class="add-btn" onclick="addToCart(${id})">+ Add</button>`
    : `<div class="qty-control">
         <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
         <span class="qty-num" id="qty-${id}">${qty}</span>
         <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
       </div>`;
}

// ===== RENDER CART =====
function renderCart() {
  const body = document.getElementById('cart-body');
  if (cart.length === 0) {
    body.innerHTML = `
      <div class="empty-cart">
        <span class="empty-cart-emoji">🛒</span>
        <h3>Your cart is empty!</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button class="empty-cart-btn" onclick="showPage('home')">Browse Menu</button>
      </div>`;
    return;
  }

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const delivery = subtotal >= 299 ? 0 : 49;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + taxes;

  body.innerHTML = `
    <div class="cart-items-list" id="cart-items-list">
      ${cart.map(item => `
        <div class="cart-item" id="cart-row-${item.id}">
          <img class="cart-item-img" src="${item.img}" alt="${item.name}" />
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₹${item.price} × ${item.qty} = <strong>₹${item.price * item.qty}</strong></div>
          </div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button class="qty-btn" onclick="cartChangeQty(${item.id}, -1)">−</button>
              <span class="qty-num" id="cart-qty-${item.id}">${item.qty}</span>
              <button class="qty-btn" onclick="cartChangeQty(${item.id}, 1)">+</button>
            </div>
            <button class="cart-remove" onclick="removeFromCart(${item.id})" title="Remove">🗑️</button>
          </div>
        </div>`).join('')}
    </div>
    <div class="cart-summary">
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${delivery === 0 ? '<span style="color:#4caf50">FREE</span>' : '₹' + delivery}</span></div>
      <div class="summary-row"><span>Taxes & Fees (5%)</span><span>₹${taxes}</span></div>
      ${delivery > 0 ? `<div class="summary-row"><span style="color:#ffc107;font-size:.75rem;">Add ₹${299 - subtotal} more for free delivery!</span></div>` : ''}
      <div class="promo-row">
        <input type="text" id="promo-input" placeholder="Enter promo code" />
        <button onclick="applyPromo()">Apply</button>
      </div>
      <div class="summary-row total"><span>Total</span><span>₹${total}</span></div>
      <button class="checkout-btn" onclick="checkout()">Proceed to Checkout →</button>
      <button class="back-btn" style="width:100%;margin-top:.7rem;text-align:center;" onclick="showPage('home')">Continue Shopping</button>
    </div>`;
}

function cartChangeQty(id, delta) {
  const item = getCartItem(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  saveCart();
  renderCart();
  updateFoodControl(id);
}

function removeFromCart(id) {
  const item = getCartItem(id);
  if (item) showToast(`${item.name} removed from cart`);
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
  updateFoodControl(id);
}

function clearCart() {
  if (cart.length === 0) return;
  if (!confirm('Clear all items from cart?')) return;
  cart = [];
  saveCart();
  renderCart();
  showToast('Cart cleared');
}

function applyPromo() {
  const code = document.getElementById('promo-input')?.value.trim().toUpperCase();
  if (code === 'FOODIEES10') showToast('🎉 Promo applied! 10% off coming soon');
  else showToast('Invalid promo code');
}

function checkout() {
  if (cart.length === 0) return;
  showToast('🎉 Order placed successfully! Yummy food is on its way!');
  cart = [];
  saveCart();
  setTimeout(() => { showPage('home'); }, 1500);
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
