function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cartCount").forEach(el => el.textContent = count);
}

async function submitAuth(form, url) {
  const data = Object.fromEntries(new FormData(form).entries());
  const message = document.getElementById("message");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message || "Something went wrong");

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    message.textContent = result.message;
    message.style.color = "green";

    setTimeout(() => location.href = "/", 700);
  } catch (err) {
    message.textContent = err.message;
    message.style.color = "crimson";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      submitAuth(loginForm, "/api/auth/login");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      submitAuth(registerForm, "/api/auth/register");
    });
  }
});
