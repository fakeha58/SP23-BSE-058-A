// routes/admin/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const requireAdmin = require('../../middleware/admin');

// List all orders
router.get('/', requireAdmin, async (req, res) => {
  const orders = await Order.find().populate('userId');
  res.render('admin/orders/index', { orders });
});

// Update order status
router.post('/status/:id', requireAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    await Order.findByIdAndUpdate(req.params.id, { status });
    req.flash('success_msg', 'Order status updated');
  } catch (err) {
    req.flash('error_msg', 'Error updating order status');
  }
  res.redirect('/admin/orders');
});

module.exports = router;