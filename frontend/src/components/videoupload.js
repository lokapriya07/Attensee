// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Button,
//   Checkbox,
//   Typography,
//   Box,
// } from '@mui/material';
// import students from './student'; // Import the student data

// const VideoUpload = () => {
//   const [video, setVideo] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [results, setResults] = useState([]);
//   const [updatedAttendance, setUpdatedAttendance] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [disengagedCount, setDisengagedCount] = useState(0);
//   const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);

//   const navigate = useNavigate();

//   // Load the results from localStorage when the component mounts
//   useEffect(() => {
//     const savedResults = localStorage.getItem('videoResults');
//     if (savedResults) {
//       const parsedResults = JSON.parse(savedResults);
//       setResults(parsedResults.results);
//       setUpdatedAttendance(parsedResults.updatedAttendance);
//       setDisengagedCount(parsedResults.disengagedCount);
//     }
//   }, []);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setVideo(file);
//     setVideoUrl(URL.createObjectURL(file));
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!video) {
//       alert('Please select a video!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('video', video);

//     setLoading(true);
//     setResults([]);
//     setDisengagedCount(0);
//     setUpdatedAttendance([]);

//     try {
//       const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       console.log(response.data.face_data);
//       const resultsData = response.data.face_data.slice(0, 30);
//       setResults(resultsData);
//       setDisengagedCount(response.data.disengaged_count);

//       // Map attendance from the API to student data
//       const updatedAttendanceData = students.map((student) => {
//         const apiData = response.data.face_data.find((face) => face.face_id === student.id);
//         return {
//           ...student,
//           isPresent: apiData ? apiData.status === 'engaged' : false,
//           faceStatus: apiData ? apiData.status : 'Not Detected',
//         };
//       });

//       setUpdatedAttendance(updatedAttendanceData);

//       // Store results in local storage only after uploading
//       localStorage.setItem(
//         'videoResults',
//         JSON.stringify({
//           results: resultsData,
//           updatedAttendance: updatedAttendanceData,
//           disengagedCount: response.data.disengaged_count,
//         })
//       );
//     } catch (error) {
//       console.error('Error processing the video:', error);
//       alert('Error processing the video');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewAttendance = () => {
//     setAttendanceDialogOpen(true);
//   };

//   const handleOverallAnalysis = () => {
//     navigate('/overall-engagement');
//   };

//   const handleAttendanceDialogClose = () => {
//     setAttendanceDialogOpen(false);
//   };

//   const handleDone = () => {
//     setAttendanceDialogOpen(false);
//   };

//   const toggleAttendance = (id) => {
//     setUpdatedAttendance((prevState) =>
//       prevState.map((student) =>
//         student.id === id
//           ? { ...student, isPresent: !student.isPresent }
//           : student
//       )
//     );
//   };

//   const handleViewMore = (studentId) => {
//     navigate(`/student/${studentId}`); // Fixed the navigation path
//   };

//   return (
//     <div style={{ textAlign: 'center', padding: '20px' }}>
//       <h2>Classroom Engagement Analysis</h2>

//       <form onSubmit={handleUpload} style={{ marginBottom: '20px' }}>
//         <input type="file" onChange={handleFileChange} accept="video/*" />
//         <button
//           type="submit"
//           style={{
//             marginLeft: '10px',
//             padding: '5px 10px',
//             backgroundColor: loading ? '#ccc' : '#007bff',
//             color: 'white',
//             border: 'none',
//             cursor: loading ? 'not-allowed' : 'pointer',
//           }}
//           disabled={loading}
//         >
//           {loading ? 'Processing...' : 'Upload'}
//         </button>
//       </form>

//       {loading && <p>Processing your video, please wait...</p>}

//       {videoUrl && (
//         <div>
//           <h3>Uploaded Video</h3>
//           <video controls width="50%">
//             <source src={videoUrl} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       )}

//       {disengagedCount > 0 && (
//         <div style={{ marginTop: '20px', color: disengagedCount > 25 ? 'red' : 'black' }}>
//           <h3>
//             {disengagedCount > 25
//               ? `⚠ Alert: ${disengagedCount} students are disengaged!`
//               : `${disengagedCount} students are disengaged.`}
//           </h3>
//         </div>
//       )}

//       {results.length > 0 && (
//         <div style={{ marginTop: '20px' }}>
//           <h3>Results</h3>
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
//             {results.map((result, index) => (
//               <div
//                 key={index}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between',
//                   width: '80%',
//                   border: '1px solid #ccc',
//                   padding: '10px',
//                   borderRadius: '10px',
//                 }}
//               >
//                 <img
//                   src={`http://127.0.0.1:5000/faces/${result.face_path}`} // Fixed URL template string
//                   alt={`Face ${index}`}
//                   style={{ width: '80px', height: '80px', borderRadius: '10px' }}
//                 />
//                 <p>Status: {result.status === 'engaged' ? '✅ Engaged' : '❌ Disengaged'}</p>
//                 <button
//                   onClick={() => handleViewMore(result.face_id)}
//                   style={{ padding: '5px 10px', marginLeft: '10px', cursor: 'pointer' }}
//                 >
//                   View More
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Attendance and Overall Analysis Buttons */}
//       {updatedAttendance.length > 0 && (
//         <div style={{ marginTop: '20px' }}>
//           <button
//             onClick={handleViewAttendance}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//               marginRight: '10px',
//             }}
//           >
//             View Attendance
//           </button>
//           <button
//             onClick={handleOverallAnalysis}
//             style={{
//               padding: '10px 20px',
//               backgroundColor: 'green',
//               color: 'white',
//               border: 'none',
//               borderRadius: '5px',
//               cursor: 'pointer',
//             }}
//           >
//             Overall Analysis
//           </button>
//         </div>
//       )}

//       {/* Attendance Dialog */}
// <Dialog open={attendanceDialogOpen} onClose={handleAttendanceDialogClose}>
//   <DialogContent>
//     <Typography variant="h6" gutterBottom>
//       Edit Attendance
//     </Typography>
//     <div
//       style={{
//         display: 'flex',
//         flexWrap: 'wrap', // Ensures horizontal layout with wrapping
//         gap: '20px', // Adds spacing between student blocks
//       }}
//     >
//       {updatedAttendance.map((student) => (
//         <div
//           key={student.id}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '10px', // Spacing between ID, name, and checkbox
//           }}
//         >
//           <Checkbox
//             checked={student.isPresent}
//             onChange={() => toggleAttendance(student.id)}
//           />
//           <span style={{ fontWeight: 'bold' }}>{student.id}</span>
//           <span>{student.name}</span>
//         </div>
//       ))}
//     </div>

//     {/* Present and Absent Counts */}
//     <Typography variant="h6" gutterBottom style={{ marginTop: '2rem' }}>
//       Present Students ({updatedAttendance.filter((student) => student.isPresent).length})
//     </Typography>
//     <Box display="flex" flexWrap="wrap" gap={1}>
//       {updatedAttendance
//         .filter((student) => student.isPresent)
//         .map((student) => (
//           <Box
//             key={student.id}
//             padding="0.5rem"
//             borderRadius="4px"
//             style={{
//               backgroundColor: 'green',
//               color: 'white',
//               textAlign: 'center',
//             }}
//           >
//             {student.id}
//           </Box>
//         ))}
//     </Box>

//     <Typography variant="h6" gutterBottom style={{ marginTop: '1rem' }}>
//       Absent Students ({updatedAttendance.filter((student) => !student.isPresent).length})
//     </Typography>
//     <Box display="flex" flexWrap="wrap" gap={1}>
//       {updatedAttendance
//         .filter((student) => !student.isPresent)
//         .map((student) => (
//           <Box
//             key={student.id}
//             padding="0.5rem"
//             borderRadius="4px"
//             style={{
//               backgroundColor: 'red',
//               color: 'white',
//               textAlign: 'center',
//             }}
//           >
//             {student.id}
//           </Box>
//         ))}
//     </Box>
//   </DialogContent>
//   <DialogActions>
//     <Button onClick={handleDone}>Done</Button>
//   </DialogActions>
// </Dialog>
//     </div>
//   );
// };

// export default VideoUpload;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import students from './student'; // Import the student data

const VideoUpload = () => {
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [results, setResults] = useState([]);
  const [updatedAttendance, setUpdatedAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disengagedCount, setDisengagedCount] = useState(0);
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedResults = localStorage.getItem('videoResults');
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults);
      setResults(parsedResults.results);
      setUpdatedAttendance(parsedResults.updatedAttendance);
      setDisengagedCount(parsedResults.disengagedCount);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setVideoUrl(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!video) {
      alert('Please select a video!');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);

    setLoading(true);
    setResults([]);
    setDisengagedCount(0);
    setUpdatedAttendance([]);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const resultsData = response.data.face_data.slice(0, 30);
      setResults(resultsData);
      setDisengagedCount(response.data.disengaged_count);

      const updatedAttendanceData = students.map((student) => {
        const apiData = response.data.face_data.find((face) => face.face_id === student.id);
        return {
          ...student,
          isPresent: apiData ? apiData.status === 'engaged' : false,
          faceStatus: apiData ? apiData.status : 'Not Detected',
        };
      });

      setUpdatedAttendance(updatedAttendanceData);

      localStorage.setItem(
        'videoResults',
        JSON.stringify({
          results: resultsData,
          updatedAttendance: updatedAttendanceData,
          disengagedCount: response.data.disengaged_count,
        })
      );
    } catch (error) {
      console.error('Error processing the video:', error);
      alert('Error processing the video');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAttendance = () => {
    setAttendanceDialogOpen(true);
  };

  const handleOverallAnalysis = () => {
    navigate('/overall-engagement');
  };

  const handleAttendanceDialogClose = () => {
    setAttendanceDialogOpen(false);
  };

  const handleDone = () => {
    setAttendanceDialogOpen(false);
  };

  const toggleAttendance = (id) => {
    setUpdatedAttendance((prevState) =>
      prevState.map((student) =>
        student.id === id
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    );
  };

  const handleViewMore = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };


  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f7f9fc' }}>
    <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#333' }}>
      Classroom Engagement Analysis
    </Typography>

    {/* Go to Dashboard Button */}
    <Box mb={3}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoToDashboard}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3f51b5',
          color: 'white',
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        Go to Dashboard
      </Button>
    </Box>

      {/* Subject, Section, and Time */}
      <Typography variant="h6" style={{ color: '#555', fontWeight: 'normal' }}>
        <strong>Subject:</strong>PP
      </Typography>
      <Typography variant="h6" style={{ color: '#555', fontWeight: 'normal' }}>
        <strong>Section:</strong> A31
      </Typography>
      <Typography variant="h6" style={{ color: '#555', fontWeight: 'normal' }}>
        <strong>Time:</strong> 9:30 AM - 10:20 AM
      </Typography>


      <form onSubmit={handleUpload} style={{ marginBottom: '20px' }}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="video/*"
          style={{
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginRight: '10px',
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{
            padding: '10px 20px',
            background: loading ? '#ccc' : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            color: 'white',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 3px 5px 2px rgba(255, 105, 135, .3)',
          }}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Upload'}
        </Button>
      </form>

      {loading && <Typography variant="body1" color="primary">Processing your video, please wait...</Typography>}

      {videoUrl && (
        <div>
          <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>Uploaded Video</Typography>
          <video controls width="60%" style={{ borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {disengagedCount > 0 && (
        <Box mt={2} style={{ color: disengagedCount > 25 ? 'red' : 'black' }}>
          <Typography variant="h6" color={disengagedCount > 25 ? 'error' : 'textSecondary'}>
            {disengagedCount > 25
              ? `⚠ Alert: ${disengagedCount} students are disengaged!`
              : `${disengagedCount} students are disengaged.`}
          </Typography>
        </Box>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>Results</Typography>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            {results.map((result, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="80%"
                border="1px solid #ccc"
                padding="10px"
                borderRadius="10px"
                boxShadow="0 3px 6px rgba(0, 0, 0, 0.1)"
                bgcolor="#fff"
              >
                <img
                  src={`http://127.0.0.1:5000/faces/${result.face_path}`}
                  alt={`Face ${index}`}
                  style={{ width: '80px', height: '80px', borderRadius: '3px' }}
                />
                <Typography variant="body1" color={result.status === 'engaged' ? 'green' : 'red'}>
                  {result.status === 'engaged' ? '✅ Engaged' : '❌ Disengaged'}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => handleViewMore(result.face_id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#1976d2', // Darker shade of blue when hovered
                      borderColor: '#1976d2', // Match border color with background
                      color: '#fff', // Change text color to white
                    },
                    borderColor: '#1976d2', // Border color when not hovered
                    color: '#1976d2', // Text color when not hovered
                  }}
                >
                  View More
                </Button>
              </Box>
            ))}
          </div>
        </div>
      )}

      {updatedAttendance.length > 0 && (
        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleViewAttendance}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: '#4caf50',
              fontWeight: 'bold',
            }}
          >
            View Attendance
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOverallAnalysis}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1976d2',
              fontWeight: 'bold',
            }}
          >
            Overall Analysis
          </Button>
        </Box>
      )}

      <Dialog open={attendanceDialogOpen} onClose={handleAttendanceDialogClose}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Edit Attendance
          </Typography>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap', // Ensures horizontal layout with wrapping
              gap: '20px', // Adds spacing between student blocks
            }}
          >
            {updatedAttendance.map((student) => (
              <div
                key={student.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px', // Spacing between ID, name, and checkbox
                }}
              >
                <Checkbox
                  checked={student.isPresent}
                  onChange={() => toggleAttendance(student.id)}
                />
                <span style={{ fontWeight: 'bold' }}>{student.id}</span>
                <span>{student.name}</span>
              </div>
            ))}
          </div>

          {/* Present and Absent Counts */}
          <Typography variant="h6" gutterBottom style={{ marginTop: '2rem' }}>
            Present Students ({updatedAttendance.filter((student) => student.isPresent).length})
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {updatedAttendance
              .filter((student) => student.isPresent)
              .map((student) => (
                <Box
                  key={student.id}
                  padding="0.5rem"
                  borderRadius="4px"
                  style={{
                    backgroundColor: 'green',
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  {student.id}
                </Box>
              ))}
          </Box>

          <Typography variant="h6" gutterBottom style={{ marginTop: '1rem' }}>
            Absent Students ({updatedAttendance.filter((student) => !student.isPresent).length})
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {updatedAttendance
              .filter((student) => !student.isPresent)
              .map((student) => (
                <Box
                  key={student.id}
                  padding="0.5rem"
                  borderRadius="4px"
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  {student.id}
                </Box>
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDone}>Done</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VideoUpload;
