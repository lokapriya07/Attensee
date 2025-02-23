import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Container, 
  Paper, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Button,
  Grid2,
  Drawer,
  List as MUIList,
  ListItemButton,
  Divider,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BarChartIcon from '@mui/icons-material/BarChart';
import GridOnIcon from '@mui/icons-material/GridOn'; 


const RealTimeEngagementDashboard = () => {
  const { sectionId, subject } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch students data from API
    const mockStudents = [
      { id: 1, name: 'Alice', engagement: 'Disengaged', color: 'red' },
      { id: 2, name: 'Bob', engagement: 'Moderately engaged', color: 'yellow' },
      { id: 3, name: 'Charlie', engagement: 'Fully engaged', color: 'green' },
    ];
    setStudents(mockStudents);
  }, [sectionId, subject]);

  const handleViewMore = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClick = (route) => {
    navigate(route);
    setMenuOpen(false); // Close the menu after navigation
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Today's Class: {subject}
          </Typography>
          <IconButton color="inherit" onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar/Drawer Menu */}
      <Drawer anchor="left" open={menuOpen} onClose={handleMenuToggle}>
        <Box
          sx={{
            width: 250,
            paddingTop: 2,
            backgroundColor: '#f5f5f5',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" sx={{ paddingLeft: 2, marginBottom: 2 }}>
            Menu
          </Typography>

          {/* Menu Item 1 */}
          <MUIList>
            <ListItemButton
              onClick={() => handleMenuClick('/overall-engagement')}
              sx={{
                padding: 1.5,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <BarChartIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Overall Analysis" />
            </ListItemButton>

            <Divider />

            {/* Menu Item 2 */}
            <ListItemButton
              onClick={() => handleMenuClick('/classroom-heatmap')}
              sx={{
                padding: 1.5,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <GridOnIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Heatmap Analysis" />
            </ListItemButton>
          </MUIList>
        </Box>
      </Drawer>

      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Grid2 container spacing={3}>
          <Grid2 item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6" gutterBottom>Classroom Grid2</Typography>
              <Grid2 container spacing={1}>
                {students.map((student) => (
                  <Grid2 item xs={3} key={student.id}>
                    <Paper 
                      elevation={1} 
                      style={{ 
                        height: '50px', 
                        backgroundColor: student.color,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {student.name[0]}
                    </Paper>
                  </Grid2>
                ))}
              </Grid2>
            </Paper>
          </Grid2>
          <Grid2 item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: '1rem', maxHeight: '400px', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>Student Engagement Analysis</Typography>
              <List>
                {students.map((student) => (
                  <ListItem key={student.id}>
                    <ListItemAvatar>
                      <Avatar>{student.name[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={student.name} 
                      secondary={student.engagement} 
                    />
                    <Button 
                      variant="outlined" 
                      onClick={() => handleViewMore(student.id)}
                    >
                      View More
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid2>
        </Grid2>
      </Container>
    </div>
  );
};

export default RealTimeEngagementDashboard;
