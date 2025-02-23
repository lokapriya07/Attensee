const User = require('../schema/User');
const jwt = require('jsonwebtoken');

// User login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // If password is stored in plain text, compare directly
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);  // Log the full error message
        res.status(500).json({ message: 'Error logging in', error: err.message });  // Return the error message in the response
    }
};

