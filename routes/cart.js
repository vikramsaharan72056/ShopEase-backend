const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Add item to cart
router.post('/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  console.log(userId, productId, quantity);
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      const newCart = new Cart({ userId, products: [{ productId, quantity }] });
      await newCart.save();
      return res.status(201).json(newCart);
    }
    const productIndex = cart.products.findIndex(p => p.productId == productId);
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all cart items for a user

router.get('/all', async (req, res) => {
  const { userId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    console.log(cart);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
