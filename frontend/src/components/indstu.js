// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { AppBar, Toolbar, IconButton, Typography, Container, Grid2222, Paper, Avatar, Button } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// const IndividualStudentEngagement = () => {
//   const { studentId } = useParams(); // Get student ID from URL
//   const [studentData, setStudentData] = useState(null);
//   const [mediaURL, setMediaURL] = useState(null); // State for media URL
//   const navigate = useNavigate();

//   // Fetch student data
//   useEffect(() => {
//     const fetchStudentData = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/student/${studentId}`);
//         const data = await response.json();

//         if (data && data.name) {
//           setStudentData(data);
//         } else {
//           console.error('Student data is missing or invalid:', data);
//           setStudentData(null);
//         }
//       } catch (error) {
//         console.error('Error fetching student data:', error);
//         setStudentData(null);
//       }
//     };

//     fetchStudentData();
//   }, [studentId]);

//   // Fetch media (video/image) for the student
//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/media/${studentId}.mp4`); // Dynamic URL for student media
//         const blob = await response.blob();

//         if (blob instanceof Blob) {
//           const objectURL = URL.createObjectURL(blob); // Create object URL
//           setMediaURL(objectURL); // Set media URL
//         } else {
//           console.error('Failed to fetch media or convert to Blob');
//         }
//       } catch (error) {
//         console.error('Error fetching media:', error);
//       }
//     };

//     fetchMedia();

//     // Cleanup Object URL
//     return () => {
//       if (mediaURL) {
//         URL.revokeObjectURL(mediaURL);
//       }
//     };
//   }, [mediaURL, studentId]);

//   // Handle Back to Dashboard
//   const handleBackToDashboard = () => {
//     const section = studentData?.section || 'Math'; // Use dynamic section or fallback to default
//     const subject = studentData?.subject || 'Algebra'; // Use dynamic subject or fallback to default
//     navigate(`/upload-video/${section}/${subject}`);
//   };

//   // Fallback for loading state
//   if (!studentData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <AppBar position="static">
//         <Toolbar>
//           <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(-1)}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h6" style={{ flexGrow: 1 }}>
//             Student Engagement Analysis
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Container maxWidth="md" style={{ marginTop: '2rem' }}>
//         <Paper elevation={3} style={{ padding: '2rem' }}>
//           <Grid2222 container spacing={3} alignItems="center">
//             <Grid2222 item>
//               <Avatar style={{ width: 100, height: 100 }}>
//                 {studentData?.name?.charAt(0) || 'U'}
//               </Avatar>
//             </Grid2222>
//             <Grid2222 item>
//               <Typography variant="h4">{studentData.name || 'Unknown'}</Typography>
//             </Grid2222>
//           </Grid2222>
//           <Grid2222 container spacing={3} style={{ marginTop: '2rem' }}>
//             <Grid2222 item xs={12} sm={6} md={4}>
//               <Paper elevation={1} style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
//                 <Typography variant="subtitle1">Color Code</Typography>
//                 <Typography variant="h6">{studentData.colorCode || 'N/A'}</Typography>
//               </Paper>
//             </Grid2222>
//             <Grid2222 item xs={12} sm={6} md={4}>
//               <Paper elevation={1} style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
//                 <Typography variant="subtitle1">Engagement Status</Typography>
//                 <Typography variant="h6">{studentData.engagementStatus || 'N/A'}</Typography>
//               </Paper>
//             </Grid2222>
//             <Grid2222 item xs={12} sm={6} md={4}>
//               <Paper elevation={1} style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
//                 <Typography variant="subtitle1">Focus Score</Typography>
//                 <Typography variant="h6">{studentData.focusScore || 'N/A'}%</Typography>
//               </Paper>
//             </Grid2222>
//             <Grid2222 item xs={12} sm={6} md={4}>
//               <Paper elevation={1} style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
//                 <Typography variant="subtitle1">Facial Expression</Typography>
//                 <Typography variant="h6">{studentData.facialExpression || 'N/A'}</Typography>
//               </Paper>
//             </Grid2222>
//             <Grid2222 item xs={12} sm={6} md={8}>
//               <Paper elevation={1} style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
//                 <Typography variant="subtitle1">Historical Engagement</Typography>
//                 <Typography variant="h6">{studentData.historicalEngagement || 'N/A'}</Typography>
//               </Paper>
//             </Grid2222>
//           </Grid2222>
//           {/* Media Section */}
//           {mediaURL && (
//             <div style={{ marginTop: '2rem', textAlign: 'center' }}>
//               <video src={mediaURL} controls style={{ width: '100%', maxHeight: '400px' }} />
//             </div>
//           )}
//           {/* Back to Dashboard button */}
//           <Button
//             variant="contained"
//             color="primary"
//             style={{ marginTop: '2rem' }}
//             onClick={handleBackToDashboard}
//           >
//             Back to Dashboard
//           </Button>
//         </Paper>
//       </Container>
//     </div>
//   );
// };

// export default IndividualStudentEngagement;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Container, Grid2, Paper, Avatar, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const IndividualStudentEngagement = () => {
  const { studentId } = useParams(); // Get student ID from URL
  const [studentData, setStudentData] = useState(null);
  const [mediaURL, setMediaURL] = useState(null);  // State for media URL (e.g., video or image)
  const navigate = useNavigate();

  // Fetch student data and media
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/student/${studentId}`);
        const data = await response.json();

        if (data && !data.error) {
          setStudentData(data);
        } else {
          console.error('Student data is missing or invalid:', data);
          setStudentData(null);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        setStudentData(null);
      }
    };

    fetchStudentData();
  }, [studentId]);

  // Loading state if student data is not available
  if (!studentData) {
    return <div>Loading...</div>;
  }

  // Handle Back to Dashboard
  const handleBackToDashboard = () => {
    const section = 'Math';  // Example static value
    const subject = 'Algebra';  // Example static value
    navigate(`/upload-video/${section}/${subject}`);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Student Engagement Analysis
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <Grid2 container spacing={3} alignItems="center">
            <Grid2 item>
              <Avatar style={{ width: 100, height: 100 }}>
                {studentData.name ? studentData.name[0] : ''}
              </Avatar>
            </Grid2>
            <Grid2 item>
              <Typography variant="h4">{studentData.name}</Typography>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3} style={{ marginTop: '2rem' }}>
            <Grid2 item xs={12} sm={6} md={4}>
              <Paper elevation={1} style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
                <Typography variant="subtitle1">Color Code</Typography>
                <Typography variant="h6">{studentData.colorCode || 'N/A'}</Typography>
              </Paper>
            </Grid2>
            <Grid2 item xs={12} sm={6} md={4}>
              <Paper elevation={1} style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
                <Typography variant="subtitle1">Engagement Status</Typography>
                <Typography variant="h6">{studentData.engagementStatus || 'N/A'}</Typography>
              </Paper>
            </Grid2>
            <Grid2 item xs={12} sm={6} md={4}>
              <Paper elevation={1} style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
                <Typography variant="subtitle1">Focus Score</Typography>
                <Typography variant="h6">{studentData.focusScore || 'N/A'}%</Typography>
              </Paper>
            </Grid2>
            <Grid2 item xs={12} sm={6} md={4}>
              <Paper elevation={1} style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
                <Typography variant="subtitle1">Facial Expression</Typography>
                <Typography variant="h6">{studentData.facialExpression || 'N/A'}</Typography>
              </Paper>
            </Grid2>
            <Grid2 item xs={12} sm={6} md={8}>
              <Paper elevation={1} style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
                <Typography variant="subtitle1">Historical Engagement</Typography>
                <Typography variant="h6">{studentData.historicalEngagement || 'N/A'}</Typography>
              </Paper>
            </Grid2>
          </Grid2>
          {/* Back to Dashboard button */}
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: '2rem' }}
            onClick={handleBackToDashboard}
          >
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default IndividualStudentEngagement;



