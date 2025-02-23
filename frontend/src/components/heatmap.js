import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Container, 
  Paper,
  Grid2
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ClassroomHeatmap = () => {
  const navigate = useNavigate();
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    // Fetch data from API or use mock data
    const mockData = [
      [2, 1, 3, 2, 1],
      [1, 3, 2, 1, 2],
      [3, 2, 1, 3, 1],
      [1, 2, 3, 2, 3],
      [2, 1, 2, 1, 2]
    ];
    setHeatmapData(mockData);
  }, []);

  const getColor = (value) => {
    switch(value) {
      case 1: return '#F44336'; // Low engagement
      case 2: return '#FFC107'; // Moderate engagement
      case 3: return '#4CAF50'; // High engagement
      default: return '#FFFFFF';
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Classroom Heatmap
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <Typography variant="h5" gutterBottom>Engagement Heatmap</Typography>
          <Grid2 container spacing={1} style={{ marginTop: '1rem' }}>
            {heatmapData.map((row, rowIndex) => (
              row.map((value, colIndex) => (
                <Grid2 item xs={12/5} key={`${rowIndex}-${colIndex}`}>
                  <Paper 
                    elevation={1}
                    style={{
                      backgroundColor: getColor(value),
                      height: '60px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant="body2" style={{ color: value === 2 ? '#000' : '#FFF' }}>
                      {value === 1 ? 'Low' : value === 2 ? 'Moderate' : 'High'}
                    </Typography>
                  </Paper>
                </Grid2>
              ))
            ))}
          </Grid2>
          <Typography variant="body2" style={{ marginTop: '1rem' }}>
            Legend: Red - Low Engagement, Yellow - Moderate Engagement, Green - High Engagement
          </Typography>
        </Paper>
      </Container>
    </div>
  );
};

export default ClassroomHeatmap;