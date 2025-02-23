const express = require('express');
const videoController = require('../controllers/videocon');
const router = express.Router();

// Route for uploading video
router.post('/upload', videoController.uploadVideo);

// Route for getting all videos of a user
router.get('/user/:userId', videoController.getUserVideos);

module.exports = router;
