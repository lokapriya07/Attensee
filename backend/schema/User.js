const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Use hashing for production
  sections: [
      {
          name: { type: String },
          subjects: [String], 
      },
  ],
});

module.exports = mongoose.model('User', userSchema);
