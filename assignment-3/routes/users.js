const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/order');
const { requireAuth } = require('../middleware/auth');

// User dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    // Get user stats
    const totalOrders = await Order.countDocuments({ userId });
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(3);
    
    const totalSpent = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.render('user/dashboard', {
      title: 'Dashboard - Fashion Store',
      layout: 'layouts/main',
      totalOrders,
      totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
      recentOrders: orders
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error_msg', 'Error loading dashboard');
    res.redirect('/');
  }
});

// User profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id);
    res.render('user/profile', {
      title: 'Profile - Fashion Store',
      layout: 'layouts/main',
      userProfile: user
    });
  } catch (error) {
    console.error('Profile error:', error);
    req.flash('error_msg', 'Error loading profile');
    res.redirect('/user/dashboard');
  }
});

// Update profile
router.post('/profile', requireAuth, async (req, res) => {
  try {
    const { name, email, phone, address, birthday } = req.body;
    const userId = req.session.user.id;
    
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email: email.toLowerCase(), 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      req.flash('error_msg', 'Email already in use by another account');
      return res.redirect('/user/profile');
    }
    
    // Update user
    await User.findByIdAndUpdate(userId, {
      name,
      email: email.toLowerCase(),
      phone,
      address,
      birthday: birthday || undefined
    });
    
    // Update session
    req.session.user.name = name;
    req.session.user.email = email.toLowerCase();
    
    req.flash('success_msg', 'Profile updated successfully');
    res.redirect('/user/profile');
    
  } catch (error) {
    console.error('Profile update error:', error);
    req.flash('error_msg', 'Error updating profile');
    res.redirect('/user/profile');
  }
});

// My Orders page (Protected Route)
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.render('user/orders', {
      title: 'My Orders - Fashion Store',
      layout: 'layouts/main',
      orders
    });
  } catch (error) {
    console.error('Orders error:', error);
    req.flash('error_msg', 'Error loading orders');
    res.redirect('/user/dashboard');
  }
});

// Legacy orders route (redirect to my-orders)
router.get('/orders', requireAuth, (req, res) => {
  res.redirect('/user/my-orders');
});

// Change password
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userId = req.session.user.id;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      req.flash('error_msg', 'Please fill in all fields');
      return res.redirect('/user/profile');
    }
    
    if (newPassword !== confirmNewPassword) {
      req.flash('error_msg', 'New passwords do not match');
      return res.redirect('/user/profile');
    }
    
    if (newPassword.length < 6) {
      req.flash('error_msg', 'New password must be at least 6 characters');
      return res.redirect('/user/profile');
    }
    
    // Get user and verify current password
    const user = await User.findById(userId);
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isCurrentPasswordValid) {
      req.flash('error_msg', 'Current password is incorrect');
      return res.redirect('/user/profile');
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    req.flash('success_msg', 'Password changed successfully');
    res.redirect('/user/profile');
    
  } catch (error) {
    console.error('Password change error:', error);
    req.flash('error_msg', 'Error changing password');
    res.redirect('/user/profile');
  }
});

module.exports = router;