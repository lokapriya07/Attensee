// const tf = require('@tensorflow/tfjs-node');
// const fs = require('fs');
// const path = require('path');

// let model;

// // Load the pre-trained model
// const loadModel = async () => {
//     try {
//         // Adjust the model path to the actual location of your model file
//         model = await tf.loadLayersModel('file://path_to_your_model/model.json');
//         console.log('Model loaded successfully');
//     } catch (error) {
//         console.error('Error loading model:', error);
//         throw error;  // Propagate error if model fails to load
//     }
// };

// // Call this function when the server starts
// loadModel().catch((error) => {
//     console.error('Model loading failed, server cannot start.');
//     process.exit(1);  // Exit the process if model loading fails
// });

// // Predict function for frames
// exports.predict = async (framePath) => {
//     if (!model) {
//         console.log('Model not loaded yet');
//         return;
//     }

//     try {
//         // Read the image as a buffer
//         const imageBuffer = fs.readFileSync(framePath);
//         const img = tf.node.decodeImage(imageBuffer);

//         // Resize the image to the required size for your model (adjust size if needed)
//         const resizedImg = tf.image.resizeBilinear(img, [224, 224]);  // Resize based on your model's expected input size
//         const inputTensor = resizedImg.expandDims(0);  // Add batch dimension

//         // Make prediction
//         const prediction = model.predict(inputTensor);

//         // Process the prediction output (you may need to post-process depending on your model's output)
//         const result = prediction.arraySync();  // Convert tensor to JavaScript array

//         // Return the prediction results
//         return { predictions: result };
//     } catch (error) {
//         console.error('Error in prediction:', error);
//         throw error;  // Handle errors during prediction
//     }
// };
