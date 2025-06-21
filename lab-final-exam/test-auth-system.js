const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');

// Create a test app to verify authentication system
const app = express();
const PORT = 3001;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration (same as your main app)
app.use(session({
  secret: 'fashion-store-secret-key-2024-mongodb',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// Global variables for templates
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  next();
});

// Test authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error_msg', 'Please log in to access this page');
    return res.redirect('/auth/login');
  }
  next();
};

// Test routes to verify authentication system
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Authentication Test - Fashion Store',
    featuredProducts: [],
    categories: []
  });
});

// Test login page
app.get('/auth/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login - Fashion Store',
    layout: 'layouts/auth'
  });
});

// Test register page
app.get('/auth/register', (req, res) => {
  res.render('auth/register', {
    title: 'Register - Fashion Store',
    layout: 'layouts/auth'
  });
});

// Test login functionality (simulated)
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulate user authentication
  if (email === 'test@example.com' && password === 'password') {
    req.session.user = {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com'
    };
    req.flash('success_msg', 'Welcome back, Test User!');
    res.redirect('/user/dashboard');
  } else {
    req.flash('error_msg', 'Invalid email or password');
    res.redirect('/auth/login');
  }
});

// Test logout
app.get('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

// Test protected dashboard
app.get('/user/dashboard', requireAuth, (req, res) => {
  res.render('user/dashboard', {
    title: 'Dashboard - Fashion Store',
    layout: 'layouts/main',
    totalOrders: 5,
    totalSpent: 299.99,
    recentOrders: []
  });
});

// Test protected orders route
app.get('/user/my-orders', requireAuth, (req, res) => {
  // Simulate user-specific orders
  const mockOrders = [
    {
      _id: 'order1',
      orderNumber: 'FS123456789',
      totalAmount: 99.99,
      status: 'Delivered',
      createdAt: new Date(),
      items: [{ name: 'Test Product', quantity: 1, price: 99.99 }]
    }
  ];
  
  res.render('user/orders', {
    title: 'My Orders - Fashion Store',
    layout: 'layouts/main',
    orders: mockOrders
  });
});

// Test protected profile
app.get('/user/profile', requireAuth, (req, res) => {
  res.render('user/profile', {
    title: 'Profile - Fashion Store',
    layout: 'layouts/main',
    userProfile: req.session.user
  });
});

app.listen(PORT, () => {
  console.log(`🧪 Authentication Test Server running on http://localhost:${PORT}`);
  console.log(`📋 Test Credentials:`);
  console.log(`   Email: test@example.com`);
  console.log(`   Password: password`);
  console.log(`\n🔐 Test the authentication system:`);
  console.log(`   1. Visit http://localhost:${PORT}`);
  console.log(`   2. Click user icon → Login`);
  console.log(`   3. Use test credentials above`);
  console.log(`   4. Test protected routes: /user/dashboard, /user/my-orders`);
  console.log(`   5. Test logout functionality`);
}); 