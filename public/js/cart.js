const API = "/api";

function getCart() { return JSON.parse(localStorage.getItem("cart") || "[]"); }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); renderCart(); }
function money(value) { return `₹${Number(value).toLocaleString("en-IN")}`; }
function token() { return localStorage.getItem("token"); }

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cartCount").forEach(el => el.textContent = count);
}

function setupUserUI() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const loginLink = document.getElementById("loginLink");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user && loginLink && logoutBtn) {
    loginLink.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
    logoutBtn.onclick = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      location.reload();
    };
  }
}

function changeQty(id, amount) {
  const cart = getCart();
  const item = cart.find(x => x.productId === id);
  if (!item) return;
  item.quantity += amount;
  if (item.quantity <= 0) {
    saveCart(cart.filter(x => x.productId !== id));
  } else {
    saveCart(cart);
  }
}

function removeItem(id) {
  saveCart(getCart().filter(x => x.productId !== id));
}

function renderCart() {
  const cart = getCart();
  const box = document.getElementById("cartItems");
  const summary = document.getElementById("cartSummary");
  const checkout = document.getElementById("checkoutForm");

  updateCartCount();

  if (!cart.length) {
    box.innerHTML = "<p>Your cart is empty. <a href='/'>Go shopping</a>.</p>";
    summary.innerHTML = "";
    checkout.classList.add("hidden");
    return;
  }

  box.innerHTML = cart.map(item => `
    <div class="cart-row">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${money(item.price)} each</p>
      </div>
      <div class="qty">
        <button onclick="changeQty('${item.productId}', -1)">−</button>
        <b>${item.quantity}</b>
        <button onclick="changeQty('${item.productId}', 1)">+</button>
      </div>
      <div>
        <b>${money(item.price * item.quantity)}</b><br>
        <button class="link-btn" onclick="removeItem('${item.productId}')">Remove</button>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  summary.innerHTML = `<h2>Total: ${money(total)}</h2>`;

  if (token()) checkout.classList.remove("hidden");
  else checkout.innerHTML = `<p>Please <a href="/login.html">login</a> to checkout.</p>`;
}

async function checkout(event) {
  event.preventDefault();

  if (!token()) {
    location.href = "/login.html";
    return;
  }

  const shippingAddress = new FormData(event.target).get("shippingAddress");
  const message = document.getElementById("checkoutMessage");

  try {
    const response = await fetch(`${API}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token()}`
      },
      body: JSON.stringify({
        shippingAddress,
        items: getCart().map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      })
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message);

    localStorage.removeItem("cart");
    message.textContent = "Order placed successfully!";
    message.style.color = "green";

    setTimeout(() => location.href = "/orders.html", 900);
  } catch (err) {
    message.textContent = err.message;
    message.style.color = "crimson";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupUserUI();
  renderCart();
  document.getElementById("checkoutForm").addEventListener("submit", checkout);
});
