// src/routes/userRoutes.js
const express = require('express');
const User = require('../schema/User');
const router = express.Router();

router.get('/data', async (req, res) => {
  const { username } = req.query;  // Username passed as query parameter
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);  // Send user data
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user data', error: err.message });
  }
});

module.exports = router;
