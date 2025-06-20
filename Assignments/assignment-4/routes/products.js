const express = require('express');
const router = express.Router();
const { 
  getAllProducts, 
  getProductById, 
  getProductsByCategory, 
  searchProducts,
  getAllCategories 
} = require('../data/products');

// All products page
router.get('/', (req, res) => {
  const { category, search, sort } = req.query;
  let products = getAllProducts();
  const categories = getAllCategories();
  
  // Filter by category
  if (category && category !== 'all') {
    products = getProductsByCategory(category);
  }
  
  // Search functionality
  if (search) {
    products = searchProducts(search);
  }
  
  // Sort products
  if (sort) {
    switch (sort) {
      case 'price-low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
  }
  
  res.render('products/index', {
    title: 'All Products - Fashion Store',
    products,
    categories,
    selectedCategory: category || 'all',
    searchQuery: search || '',
    selectedSort: sort || '',
    layout: 'layouts/main'
  });
});

// Single product page
router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = getProductById(productId);
  
  if (!product) {
    req.flash('error_msg', 'Product not found');
    return res.redirect('/products');
  }
  
  // Get related products (same category, excluding current product)
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== productId)
    .slice(0, 4);
  
  res.render('products/single', {
    title: `${product.name} - Fashion Store`,
    product,
    relatedProducts,
    layout: 'layouts/main'
  });
});

module.exports = router;