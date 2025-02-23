const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Function to extract frames from video
exports.extractFrames = (videoPath) => {
    return new Promise((resolve, reject) => {
        const framesDir = 'extracted_frames/';
        if (!fs.existsSync(framesDir)) {
            fs.mkdirSync(framesDir);
        }

        ffmpeg(videoPath)
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .output(path.join(framesDir, 'frame-%04d.png')) // Save frames as PNG
            .run();
    });
};
