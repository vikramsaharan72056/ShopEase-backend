const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Get all orders
router.get('/:userId', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  // Create a new order
  router.post('/create/:userId', async (req, res) => {
    const { userId, items, totalAmount, paymentMethod, isPaid } = req.body;
    try {    
      const order = new Order({ userId, items, totalAmount, paymentMethod, isPaid });
      await order.save();
      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get a specific order by ID
  router.get('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update a specific order by ID
  router.put('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      order.status = status;
      await order.save();
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  module.exports = router;