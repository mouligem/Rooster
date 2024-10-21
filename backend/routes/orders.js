// routes/orders.js (or wherever your routes are defined)
const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');

// Update order status
router.put('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  if (!['Not Completed', 'Completed'].includes(orderStatus)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
