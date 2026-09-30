const express = require("express");
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!shippingAddress || shippingAddress.trim().length < 8) {
      return res.status(400).json({ message: "Enter a valid shipping address" });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Invalid quantity");
      }

      if (product.stock < quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      product.stock -= quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity
      });

      totalAmount += product.price * quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress.trim()
    });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Could not place order" });
  }
});

router.get("/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Could not load orders", error: err.message });
  }
});

module.exports = router;
