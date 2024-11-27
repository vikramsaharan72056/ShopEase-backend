const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Add item to cart
router.post('/add', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = new Cart({ userId, products: [{ productId, quantity }] });
      await newCart.save();
      return res.status(201).json(newCart);
    }

    const productIndex = cart.products.findIndex((p) => p.productId == productId);

    if (productIndex >= 0) {
      // Increment quantity if the product already exists
      cart.products[productIndex].quantity += quantity;
    } else {
      // Add new product if it doesn't exist
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    const populatedCart = await cart.populate('products.productId', 'name price image');
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all cart items for a user
router.get('/all/:userId', async (req, res) => {
  const { userId } = req.params;
  

  try {
    const cart = await Cart.find({ userId }).populate(
      'products.productId',
      'name price image'
    );

    

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update quantity of a specific cart item
// Update cart to remove ordered items
router.put('/update/:userId', async (req, res) => {
  const { userId } = req.params;
  const { orderedProductIds } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out ordered items from the cart
    cart.products = cart.products.filter(
      (item) => !orderedProductIds.includes(item.productId.toString())
    );

    await cart.save();
    const populatedCart = await cart.populate('products.productId', 'name price image');
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Remove item from cart
router.delete('/:itemId', async (req, res) => {
  const { userId } = req.query;
  const { itemId } = req.params;
  console.log(req.params, "productId");
  console.log(userId, "userId");


  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter((p) => p.productId != itemId);

    await cart.save();
    const populatedCart = await cart.populate('products.productId', 'name price image');
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
