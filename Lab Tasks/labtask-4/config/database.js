const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = 'mongodb+srv://fakehamazhar0808:fakeha@cluster0.m9c02rx.mongodb.net/authenticaation-sys';

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
