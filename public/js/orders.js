const API = "/api";

function money(value) { return `₹${Number(value).toLocaleString("en-IN")}`; }

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
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
      location.href = "/";
    };
  }
}

async function loadOrders() {
  const box = document.getElementById("ordersList");
  const token = localStorage.getItem("token");

  if (!token) {
    box.innerHTML = "<p>Please <a href='/login.html'>login</a> to view your orders.</p>";
    return;
  }

  try {
    const response = await fetch(`${API}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const orders = await response.json();

    if (!response.ok) throw new Error(orders.message);

    if (!orders.length) {
      box.innerHTML = "<p>No orders yet.</p>";
      return;
    }

    box.innerHTML = orders.map(order => `
      <article class="order-card">
        <div class="order-head">
          <div>
            <b>Order ID:</b> ${order._id}<br>
            <small>${new Date(order.createdAt).toLocaleString()}</small>
          </div>
          <span class="status">${order.status}</span>
        </div>
        ${order.items.map(item => `<p>${item.name} × ${item.quantity} — ${money(item.price * item.quantity)}</p>`).join("")}
        <hr>
        <p><b>Total: ${money(order.totalAmount)}</b></p>
        <p><b>Address:</b> ${order.shippingAddress}</p>
      </article>
    `).join("");
  } catch (err) {
    box.innerHTML = `<p>${err.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  setupUserUI();
  loadOrders();
});
