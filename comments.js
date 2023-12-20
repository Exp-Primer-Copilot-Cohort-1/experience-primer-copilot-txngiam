// Create web server

// Import Express
const express = require('express');

// Import Express Router
const router = express.Router();

// Import Express Validator
const { check, validationResult } = require('express-validator');

// Import Gravatar
const gravatar = require('gravatar');

// Import bcrypt
const bcrypt = require('bcryptjs');

// Import Json Web Token
const jwt = require('jsonwebtoken');

// Import config
const config = require('config');

// Import User Model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
// @validation
// 1. Check the name field is not empty
// 2. Check the email field is not empty
// 3. Check the email field is a valid email address
// 4. Check the password field is not empty
// 5. Check the password field has a minimum length of 6 characters
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check(
      'password',
      'Please enter a password with at least 6 characters'
    ).isLength({ min: 6 }),
  ],

  // Callback function
  async (req, res) => {
    // Check for errors in the request
    const errors = validationResult(req);

    // If there are errors in the request
    if (!errors.isEmpty()) {
      // Return a bad request status and the errors
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the request
    const { name, email, password } = req.body;

    try {
      // See if the user exists
      let user = await User.findOne({ email });

      // If the user exists
      if (user) {
        // Return a bad request status and a message
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get the user's Gravatar
      const avatar = gravatar.url(email, {
        // Size
        s: '200',
        // Rating
        r: 'pg',
        // Default
        d: 'mm',
      });

      // Create a new instance of a user
      user = new User();
    } catch (err) {
      // Log the error
      console.error(err.message);

      // Return a server error status and a message
      res.status(500).send('Server error');
    }
);