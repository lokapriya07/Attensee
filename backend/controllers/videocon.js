const multer = require('multer');
const Video = require('../schema/Video');
const path = require('path');
const { extractFrames } = require('../utils/extractFrames');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Upload video function
const uploadVideo = async (req, res) => {
    const { userId } = req.body;

    // Check if file exists
    if (!req.file) {
        return res.status(400).json({ message: 'No video file uploaded' });
    }

    try {
        const newVideo = new Video({
            videoUrl: req.file.path,
            uploadedBy: userId,
            status: 'processing',
        });

        await newVideo.save();

        // Process the video and extract frames
        extractFrames(req.file.path)
            .then(() => {
                newVideo.status = 'processed';
                return newVideo.save();
            })
            .then(() => {
                res.status(200).json({ message: 'Video uploaded and processing started', video: newVideo });
            })
            .catch((err) => {
                res.status(500).json({ message: 'Error processing video', error: err.message });
            });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading video', error: err.message });
    }
};

// Get videos for a user
const getUserVideos = async (req, res) => {
    const { userId } = req.params;

    try {
        const videos = await Video.find({ uploadedBy: userId });

        if (videos.length === 0) {
            return res.status(404).json({ message: 'No videos found for this user' });
        }

        res.status(200).json(videos);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching videos', error: err.message });
    }
};

module.exports = {
    uploadVideo: [upload.single('video'), uploadVideo], // Middleware chain
    getUserVideos,
};
