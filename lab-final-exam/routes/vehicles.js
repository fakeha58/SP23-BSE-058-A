const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Display all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.render('vehicles/index', { vehicles, layout: 'layouts/main' });
  } catch (err) {
    req.flash('error_msg', 'Could not fetch vehicles.');
    res.redirect('/');
  }
});

module.exports = router; 