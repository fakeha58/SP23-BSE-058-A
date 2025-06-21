// index.js
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/myDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB!");
  console.log(`Hello Node.js v${process.versions.node}!`);
})
.catch((err) => {
  console.error("❌ Failed to connect:", err);
});
