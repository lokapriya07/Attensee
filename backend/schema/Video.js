const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    videoUrl: { type: String, required: true },  // Path or URL to the uploaded video
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadDate: { type: Date, default: Date.now },
    status: { type: String, default: 'processing' },  // processing, completed, failed
    engagementData: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EngagementData' }] // Stores each student's engagement status
});

module.exports = mongoose.model('Video', videoSchema);

