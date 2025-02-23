import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SignIn from './components/login';
import Dashboard from './components/dash';
import RealTimeEngagementDashboard from './components/realtime';
import IndividualStudentEngagement from './components/indstu';
// import ImageUpload from './components/fileupload';
import { TeacherProvider } from './components/teachercontext';
// import StudentList from './components/stulist';
// import StudentAnalysis from './components/stuanalysis';
import { ClassProvider } from './components/classcontext';
import OverallClassEngagement from './components/overallclass';
import ClassroomHeatmap from './components/heatmap';
import VideoUpload from './components/videoupload';
import AttendanceFeature from './components/attendance';
import Reports from './components/reports';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TeacherProvider> {/* Teacher-related context */}
          <ClassProvider> {/* Class-related context */}
            <Routes>
              {/* General Routes */}
              <Route path="/login" element={<SignIn />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Teacher-Related Routes */}
              <Route path="/upload-video/:section/:subject" element={<VideoUpload />} />
              {/* Class-Related Routes */}
              <Route path="/class/:sectionId/:subject" element={<RealTimeEngagementDashboard />} />
              <Route path="/student/:studentId" element={<IndividualStudentEngagement />} />
              <Route path="/overall-engagement" element={<OverallClassEngagement />} />
              <Route path="/classroom-heatmap" element={<ClassroomHeatmap />} />
              <Route path="/attendance" element={<AttendanceFeature />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </ClassProvider>
        </TeacherProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
