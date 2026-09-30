const API = "/api";

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cartCount").forEach(el => el.textContent = count);
}
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.productId === product._id);
  if (existing) existing.quantity++;
  else cart.push({ productId: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Product added to cart");
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
      location.href = "/";
    };
  }
}
async function loadProduct() {
  const id = new URLSearchParams(location.search).get("id");
  const box = document.getElementById("productDetails");

  if (!id) {
    box.innerHTML = "<h2>Product ID missing.</h2>";
    return;
  }

  try {
    const response = await fetch(`${API}/products/${id}`);
    const product = await response.json();

    if (!response.ok) throw new Error(product.message);

    box.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div>
        <span class="muted">${product.category}</span>
        <h1>${product.name}</h1>
        <p>${product.description}</p>
        <p class="price">${money(product.price)}</p>
        <p class="stock">${product.stock} items available</p>
        <button class="btn" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
      </div>
    `;
  } catch (err) {
    box.innerHTML = `<h2>${err.message}</h2>`;
  }
}
function money(value) { return `₹${Number(value).toLocaleString("en-IN")}`; }
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setupUserUI();
  loadProduct();
});
