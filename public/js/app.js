const API = "/api";
const money = value => `₹${Number(value).toLocaleString("en-IN")}`;

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cartCount").forEach(el => el.textContent = count);
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.productId === product._id);

  if (existing) existing.quantity += 1;
  else cart.push({
    productId: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1
  });

  saveCart(cart);
  alert(`${product.name} added to cart`);
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

async function loadProducts() {
  const search = document.getElementById("search").value.trim();
  const category = document.getElementById("category").value;

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "<p>Loading products...</p>";

  try {
    const response = await fetch(`${API}/products?${params.toString()}`);
    const products = await response.json();

    if (!products.length) {
      grid.innerHTML = "<p>No products found.</p>";
      return;
    }

    grid.innerHTML = products.map(product => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <span class="muted">${product.category}</span>
          <h3>${product.name}</h3>
          <p class="stock">${product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
          <p class="price">${money(product.price)}</p>
          <div class="card-actions">
            <a class="btn" href="/product.html?id=${product._id}">Details</a>
            <button class="btn" onclick='addToCart(${JSON.stringify(product)})' ${product.stock === 0 ? "disabled" : ""}>Add</button>
          </div>
        </div>
      </article>
    `).join("");
  } catch {
    grid.innerHTML = "<p>Could not connect to the server.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setupUserUI();

  if (document.getElementById("productGrid")) {
    loadProducts();
    document.getElementById("search").addEventListener("input", loadProducts);
    document.getElementById("category").addEventListener("change", loadProducts);
  }
});
