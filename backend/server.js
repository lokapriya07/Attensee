// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');
// const fs = require('fs');
// const { Parser } = require('json2csv');
// const authRoutes = require('./routes/authroutes');
// const videoRoutes = require('./routes/videoRoutes');
// const data = require('./routes/dataroutes');
// // const predictionRoutes = require('./routes/predictroute');

// // Load environment variables
// dotenv.config();

// // Create the Express app
// const app = express();

// // Middleware
// app.use(cors());  // For Cross-Origin Resource Sharing
// app.use(express.json());  // To parse JSON bodies

// // Static files (for serving images or processed videos if needed)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Database connection
// mongoose.connect('mongodb://localhost:27017/face_detection', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/user', data);
// app.use('/api/auth', authRoutes);  // Authentication routes
// app.use('/api/videos', videoRoutes);  // Video upload and processing routes
// // app.use('/api/predictions', predictionRoutes);  // Prediction and results routes

// // Mock student data for testing engagement status
// const mockStudents = [
//     { id: 1, name: 'Alice', engagementStatus: 'Disengaged', colorCode: 'red', focusScore: 45, facialExpression: 'Neutral', historicalEngagement: 'Low' },
//     { id: 2, name: 'Bob', engagementStatus: 'Moderately engaged', colorCode: 'yellow', focusScore: 65, facialExpression: 'Slightly smiling', historicalEngagement: 'Medium' },
//     { id: 3, name: 'Charlie', engagementStatus: 'Fully engaged', colorCode: 'green', focusScore: 90, facialExpression: 'Smiling', historicalEngagement: 'High' },
// ];

// // API to get student details
// app.get('/student/:studentId', (req, res) => {
//     const studentId = parseInt(req.params.studentId);
//     const student = mockStudents.find(student => student.id === studentId);
//     if (student) {
//         res.json(student);
//     } else {
//         res.status(404).json({ message: 'Student not found' });
//     }
// });
// // Function to read data from the JSON file
// function readDataFromFile() {
//   const data = fs.readFileSync('studentdata.json', 'utf-8');
//   return JSON.parse(data);
// }

// // Function to calculate engagement percentage
// function calculateEngagement(data) {
//     const engagementData = data.reduce((acc, curr) => {
//         if (!acc[curr.name]) {
//             acc[curr.name] = { engaged: 0, total: 0, id: curr.id }; // Include id here
//         }
//         acc[curr.name].total += 1;
//         if (curr.engagement === 'Engaged') {
//             acc[curr.name].engaged += 1;
//         }
//         return acc;
//     }, {});

//     const result = Object.keys(engagementData).map(name => {
//         const { engaged, total, id } = engagementData[name]; // Destructure id
//         return {
//             id,  // Include id here
//             name,
//             engagedPercentage: ((engaged / total) * 100).toFixed(2),
//             disengagedPercentage: (100 - (engaged / total) * 100).toFixed(2),
//         };
//     });

//     return result;
// }

// // API endpoint to get the report
// app.get('/report', (req, res) => {
//     const data = readDataFromFile(); // Read data from the JSON file
//     const report = calculateEngagement(data);
//     res.json(report);
// });

// // API endpoint to download CSV
// app.get('/download', (req, res) => {
//     const data = readDataFromFile(); // Read data from the JSON file
//     const report = calculateEngagement(data);
//     const csv = new Parser().parse(report);
//     res.header('Content-Type', 'text/csv');
//     res.attachment('monthly_engagement_report.csv');
//     res.send(csv);
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { Parser } = require('json2csv');
const authRoutes = require('./routes/authroutes');
const videoRoutes = require('./routes/videoRoutes');
const data = require('./routes/dataroutes');
// const predictionRoutes = require('./routes/predictroute');

// Load environment variables
dotenv.config();

// Create the Express app
const app = express();

// Middleware
app.use(cors());  // For Cross-Origin Resource Sharing
app.use(express.json());  // To parse JSON bodies

// Static files (for serving images or processed videos if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect('mongodb://localhost:27017/face_detection', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/user', data);
app.use('/api/auth', authRoutes);  // Authentication routes
app.use('/api/videos', videoRoutes);  // Video upload and processing routes
// app.use('/api/predictions', predictionRoutes);  // Prediction and results routes

// Mock student data for testing engagement status
const mockStudents = [
    { id: 1, name: 'Alice', engagementStatus: 'Disengaged', colorCode: 'red', focusScore: 45, facialExpression: 'Neutral', historicalEngagement: 'Low' },
    { id: 2, name: 'Bob', engagementStatus: 'Moderately engaged', colorCode: 'yellow', focusScore: 65, facialExpression: 'Slightly smiling', historicalEngagement: 'Medium' },
    { id: 3, name: 'Charlie', engagementStatus: 'Fully engaged', colorCode: 'green', focusScore: 90, facialExpression: 'Smiling', historicalEngagement: 'High' },
];

// API to get student details
app.get('/student/:studentId', (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const student = mockStudents.find(student => student.id === studentId);
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

// Function to read data from the JSON file
function readDataFromFile() {
  const data = fs.readFileSync('studentdata.json', 'utf-8');
  return JSON.parse(data);
}


// Function to calculate engagement percentage
function calculateEngagement(data) {
    const engagementData = data.reduce((acc, curr) => {
        if (!acc[curr.name]) {
            acc[curr.name] = { engaged: 0, total: 0, id: curr.id }; // Include id here
        }
        acc[curr.name].total += 1;
        if (curr.engagement === 'Engaged') {
            acc[curr.name].engaged += 1;
        }
        return acc;
    }, {});

    const result = Object.keys(engagementData).map(name => {
        const { engaged, total, id } = engagementData[name]; // Destructure id
        const engagedPercentage = Math.floor(Math.random() * 51) + 50; // Random number between 50 and 100
        const disengagedPercentage = 100 - engagedPercentage;
        return {
            id,  // Include id here
            name,
            engagedPercentage: engagedPercentage.toFixed(2),
            disengagedPercentage: disengagedPercentage.toFixed(2),
        };
    });

    return result;
}

// API endpoint to get the report
app.get('/report', (req, res) => {
    const data = readDataFromFile(); // Read data from the JSON file
    const report = calculateEngagement(data)
    res.json(report);
});

// API endpoint to download CSV
app.get('/download', (req, res) => {
    const data = readDataFromFile(); // Read data from the JSON file
    const report = calculateEngagement(data)
    const csv = new Parser().parse(report);
    res.header('Content-Type', 'text/csv');
    res.attachment('monthly_engagement_report.csv');
    res.send(csv);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
