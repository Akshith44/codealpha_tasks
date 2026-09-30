require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Wireless Headphones",
    description: "Comfortable wireless headphones with clear sound and long battery life.",
    price: 1499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    stock: 15
  },
  {
    name: "Smart Watch",
    description: "Modern smartwatch with fitness tracking, notifications and a bright display.",
    price: 2299,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    stock: 12
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes designed for everyday comfort.",
    price: 1899,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    stock: 20
  },
  {
    name: "Backpack",
    description: "Water-resistant laptop backpack suitable for college and office.",
    price: 999,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    stock: 25
  },
  {
    name: "Coffee Maker",
    description: "Compact coffee maker for quick and easy home brewing.",
    price: 2499,
    category: "Home",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    stock: 8
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with tactile switches for coding and gaming.",
    price: 2799,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    stock: 10
  }
];

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Sample products inserted");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
