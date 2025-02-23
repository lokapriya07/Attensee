const engagementDataSchema = new mongoose.Schema({
    studentId: { type: String, required: true },  // ID of the student
    engagementStatus: { type: String, required: true },  // 'active', 'sleepy', 'disengaged'
    faceImageUrl: { type: String, required: true }, // URL to the cropped face image
    faceBoundingBox: { type: Object, required: true }, // Bounding box coordinates
    additionalDetails: { type: String }  // Optional additional information, e.g., notes about engagement
});

module.exports = mongoose.model('EngagementData', engagementDataSchema);
