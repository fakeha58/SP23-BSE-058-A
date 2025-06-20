// Sample product data for fashion store
const products = [
  {
    id: 1,
    name: 'Premium Leather Jacket',
    description: 'Luxurious genuine leather jacket perfect for any season. Crafted with attention to detail and premium materials.',
    price: 299.99,
    originalPrice: 399.99,
    category: 'jackets',
    image: '/images/img1.webp',
    images: [
      '/images/img1.webp',
      '/images/img2.PNG'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown'],
    featured: true,
    inStock: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: 'Casual Cotton Shirt',
    description: 'Comfortable and breathable cotton shirt perfect for everyday wear. Available in multiple colors.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'shirts',
    image: '/images/img3.PNG',
    images: [
      '/images/img3.PNG',
      '/images/img4.PNG'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Gray'],
    featured: true,
    inStock: true,
    rating: 4.5,
    reviews: 89
  },
  {
    id: 3,
    name: 'Designer Jeans',
    description: 'Premium denim jeans with perfect fit and comfort. Made from high-quality denim fabric.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'jeans',
    image: '/images/img5.PNG',
    images: [
      '/images/img5.PNG',
      '/images/img6.PNG'
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Dark Blue', 'Light Blue', 'Black'],
    featured: false,
    inStock: true,
    rating: 4.6,
    reviews: 156
  },
  {
    id: 4,
    name: 'Summer Dress',
    description: 'Beautiful floral summer dress perfect for warm weather. Light and comfortable fabric.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'dresses',
    image: '/images/img7.PNG',
    images: [
      '/images/img7.PNG',
      '/images/img8.PNG'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral', 'Solid Blue', 'White'],
    featured: true,
    inStock: true,
    rating: 4.7,
    reviews: 203
  },
  {
    id: 5,
    name: 'Sneakers Collection',
    description: 'Comfortable and stylish sneakers for everyday wear. Perfect blend of comfort and style.',
    price: 159.99,
    originalPrice: 199.99,
    category: 'shoes',
    image: '/images/img9.webp',
    images: [
      '/images/img9.webp',
      '/images/img10.webp'
    ],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black', 'Gray'],
    featured: false,
    inStock: true,
    rating: 4.4,
    reviews: 67
  },
  {
    id: 6,
    name: 'Wool Sweater',
    description: 'Cozy wool sweater perfect for cold weather. Soft and warm with elegant design.',
    price: 119.99,
    originalPrice: 149.99,
    category: 'sweaters',
    image: '/images/img11.webp',
    images: [
      '/images/img11.webp',
      '/images/img12.webp'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Navy', 'Burgundy'],
    featured: true,
    inStock: true,
    rating: 4.9,
    reviews: 178
  }
];

const categories = [
  { id: 'all', name: 'All Products', count: products.length },
  { id: 'jackets', name: 'Jackets', count: products.filter(p => p.category === 'jackets').length },
  { id: 'shirts', name: 'Shirts', count: products.filter(p => p.category === 'shirts').length },
  { id: 'jeans', name: 'Jeans', count: products.filter(p => p.category === 'jeans').length },
  { id: 'dresses', name: 'Dresses', count: products.filter(p => p.category === 'dresses').length },
  { id: 'shoes', name: 'Shoes', count: products.filter(p => p.category === 'shoes').length },
  { id: 'sweaters', name: 'Sweaters', count: products.filter(p => p.category === 'sweaters').length }
];

const getAllProducts = () => products;

const getProductById = (id) => products.find(product => product.id === id);

const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

const getFeaturedProducts = () => {
  return products.filter(product => product.featured);
};

const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
};

const getAllCategories = () => categories;

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  searchProducts,
  getAllCategories
};