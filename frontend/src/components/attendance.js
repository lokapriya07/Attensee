import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import studentsData from './student.js'; // Replace with your JSON data file

const AttendanceFeature = () => {
  const [attendanceDialogOpen, setAttendanceDialogOpen] = useState(false);
  const [attendance, setAttendance] = useState(
    studentsData.map(student => ({
      id: student.id,
      name: student.name,
      isPresent: true, // Assume all students are present initially
    }))
  );
  const [updatedAttendance, setUpdatedAttendance] = useState([...attendance]); // To manage interim edits

  const toggleAttendance = id => {
    setUpdatedAttendance(prevState =>
      prevState.map(student =>
        student.id === id
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    );
  };

  const handleAttendanceDialogOpen = () => {
    setAttendanceDialogOpen(true);
    setUpdatedAttendance([...attendance]); // Reset interim edits
  };

  const handleAttendanceDialogClose = () => {
    setAttendanceDialogOpen(false);
  };

  const handleDone = () => {
    setAttendance([...updatedAttendance]); // Commit interim edits
    setAttendanceDialogOpen(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Class Engagement and Attendance
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <Typography variant="h5" gutterBottom>
            Attendance Feature
          </Typography>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAttendanceDialogOpen}
            >
              Show Attendance
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Attendance Dialog */}
      <Dialog open={attendanceDialogOpen} onClose={handleAttendanceDialogClose}>
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent>
          {/* Edit Attendance */}
          <Typography variant="h6" gutterBottom>
            Edit Attendance
          </Typography>
          {updatedAttendance.map(student => (
            <FormControlLabel
              key={student.id}
              control={
                <Checkbox
                  checked={student.isPresent}
                  onChange={() => toggleAttendance(student.id)}
                />
              }
              label={`${student.id} - ${student.name}`}
            />
          ))}

          {/* Present Students */}
          <Typography variant="h6" gutterBottom style={{ marginTop: '2rem' }}>
            Present Students ({updatedAttendance.filter(student => student.isPresent).length})
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {updatedAttendance
              .filter(student => student.isPresent)
              .map(student => (
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

          {/* Absent Students */}
          <Typography variant="h6" gutterBottom style={{ marginTop: '1rem' }}>
            Absent Students ({updatedAttendance.filter(student => !student.isPresent).length})
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {updatedAttendance
              .filter(student => !student.isPresent)
              .map(student => (
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
          <Button onClick={handleDone} color="primary" variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AttendanceFeature;
