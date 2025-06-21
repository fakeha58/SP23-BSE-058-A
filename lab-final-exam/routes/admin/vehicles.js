const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Vehicle = require('../../models/Vehicle');
const requireAdmin = require('../../middleware/admin');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../public/images/vehicles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// List all vehicles
router.get('/', requireAdmin, async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.render('admin/vehicles/index', { vehicles, layout: 'layouts/main' });
  } catch (err) {
    req.flash('error_msg', 'Error fetching vehicles');
    res.redirect('/admin/dashboard');
  }
});

// Show add vehicle form
router.get('/add', requireAdmin, (req, res) => {
  res.render('admin/vehicles/add', { layout: 'layouts/main' });
});

// Handle add vehicle
router.post('/add', requireAdmin, upload.single('image'), async (req, res) => {
  const { name, brand, price, type } = req.body;
  const image = req.file ? `/images/vehicles/${req.file.filename}` : '';

  try {
    await Vehicle.create({ name, brand, price, type, image });
    req.flash('success_msg', 'Vehicle added successfully');
    res.redirect('/admin/vehicles');
  } catch (err) {
    req.flash('error_msg', 'Error adding vehicle');
    res.redirect('/admin/vehicles/add');
  }
});

// Show edit vehicle form
router.get('/edit/:id', requireAdmin, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      req.flash('error_msg', 'Vehicle not found');
      return res.redirect('/admin/vehicles');
    }
    res.render('admin/vehicles/edit', { vehicle, layout: 'layouts/main' });
  } catch (err) {
    req.flash('error_msg', 'Error fetching vehicle');
    res.redirect('/admin/vehicles');
  }
});

// Handle edit vehicle
router.post('/edit/:id', requireAdmin, upload.single('image'), async (req, res) => {
  const { name, brand, price, type } = req.body;
  let image;

  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      req.flash('error_msg', 'Vehicle not found');
      return res.redirect('/admin/vehicles');
    }

    if (req.file) {
      // Delete old image if it exists
      if (vehicle.image) {
        const oldImagePath = path.join(__dirname, '../../public', vehicle.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/images/vehicles/${req.file.filename}`;
    } else {
      image = vehicle.image;
    }

    await Vehicle.findByIdAndUpdate(req.params.id, { name, brand, price, type, image });
    req.flash('success_msg', 'Vehicle updated successfully');
    res.redirect('/admin/vehicles');
  } catch (err) {
    req.flash('error_msg', 'Error updating vehicle');
    res.redirect(`/admin/vehicles/edit/${req.params.id}`);
  }
});

// Handle delete vehicle
router.post('/delete/:id', requireAdmin, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle && vehicle.image) {
      const imagePath = path.join(__dirname, '../../public', vehicle.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await Vehicle.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Vehicle deleted successfully');
  } catch (err) {
    req.flash('error_msg', 'Error deleting vehicle');
  }
  res.redirect('/admin/vehicles');
});

module.exports = router; 