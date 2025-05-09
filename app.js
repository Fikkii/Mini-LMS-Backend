const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();
// ✅ Middlewares
app.use(express.json());
app.use(cors())
// Passport local strategy for username or email

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');  // Import the courses routes

const PORT = process.env.PORT || 5000;



// MongoDB Connection
const uri = "mongodb+srv://ajalafikayo:bunmisegun@cluster0.tgne0g5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

