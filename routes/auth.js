const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'bunmisegun';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',  // We are using email as the identifier
      passwordField: 'password',  // Standard password field
    },
    async (email, password, done) => {
      try {
        console.log('Attempting login with email:', email);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Incorrect Username or Password' });
        }

        // Compare the password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect Username or Password' });
        }

        return done(null, user);
      } catch (err) {
        console.log('Error during authentication:', err);
        return done(err);
      }
    }
  )
);


const transporter = nodemailer.createTransport({
    host: "mail.fikki.com.ng",
    port: 587,
    secure: false,
    auth: {
        user: "fikkicom",
        pass: "265yPd+YW4U@gx"
    }
})

async function eAccountNotification(){
    const info = await transporter.sendMail({
        from: "'Account Creation' <support@fikki.com.ng>",
        to: "ajalafikayo@gmail.com",
        subject: "Welcome to NHBC Learning Cohort",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to NHCB Cohort</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .header {
      text-align: center;
      color: #2e8b57;
    }
    .content {
      margin-top: 20px;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      margin-top: 30px;
      padding: 12px 24px;
      background-color: #2e8b57;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      margin-top: 40px;
      font-size: 12px;
      text-align: center;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h2 class="header">🎉 Welcome to NHBC Cohort!</h2>
    <div class="content">
      <p>Hi there,</p>
      <p>Your account has been successfully created. We're excited to have you on board!</p>
      <p>This is the start of a hands-on, project-based learning journey. We encourage you to log in and explore your first module.</p>

      <a class="cta-button" href="http://localhost:5173/login">Login & Start Learning</a>

      <p>If you have any questions or need support, feel free to reach out to our team at any time.</p>

      <p>Best regards,<br/>The [Your Cohort Name] Team</p>
    </div>

    <div class="footer">
      &copy; 2025 NHBC. All rights reserved.
    </div>
  </div>
</body>
</html>

        `,
    }, () => {
        console.log('Message sent successfully')
    })
}


// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        const { fullname, phone, course, email, password } = req.body;

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'An account already exists with this email' });
        }

        // Create new user
        const user = new User({ email, password, phone, course, fullname });
        await user.save();

        eAccountNotification()

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({ message: info?.message || 'Login failed' });
    }

    const payload = {
      id: user._id,
      username: user.username,
      course: user.course
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: payload });
  })(req, res, next);
});

module.exports = router;

