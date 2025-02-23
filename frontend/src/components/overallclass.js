import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Container, 
  Paper, 
  Box 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import students from './student.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const OverallClassEngagement = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({});
  const [insights, setInsights] = useState("");

  useEffect(() => {
    const totalStudents = students.length;
    const engagedCount = students.filter(student => student.engagement === 'Engaged').length;
    const disengagedCount = totalStudents - engagedCount;

    const engagedPercentage = ((engagedCount / totalStudents) * 100).toFixed(1);
    const disengagedPercentage = ((disengagedCount / totalStudents) * 100).toFixed(1);

    const data = {
      labels: ['Engaged', 'Disengaged'],
      datasets: [
        {
          data: [engagedPercentage, disengagedPercentage],
          backgroundColor: ['#4CAF50', '#F44336'],
          hoverBackgroundColor: ['#45a049', '#da190b']
        }
      ]
    };
    setChartData(data);

    setInsights(
      `Out of ${totalStudents} students, 
       <b style="color: #4CAF50;">${engagedCount} (${engagedPercentage}%)</b> 
       are <b>Engaged</b> and 
       <b style="color: #F44336;">${disengagedCount} (${disengagedPercentage}%)</b> 
       are <b>Disengaged</b>.`
    );
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Overall Class Engagement Analysis
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem' }}>
          <Typography variant="h5" gutterBottom>Class Engagement Distribution</Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            {/* Pie Chart */}
            <Box style={{ height: '400px', flex: 1 }}>
              {Object.keys(chartData).length > 0 && (
                <Pie 
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false, // Hide legend in chart
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            let label = context.label || '';
                            if (label) {
                              label += ': ';
                            }
                            if (context.parsed !== null) {
                              label += context.parsed + '%';
                            }
                            return label;
                          }
                        }
                      }
                    }
                  }}
                />
              )}
            </Box>
            {/* Labels Beside Pie Chart */}
            <Box style={{ flex: 1, marginLeft: '2rem' }}>
              {chartData.labels?.map((label, index) => (
                <Box key={index} display="flex" alignItems="center" mb={2}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: chartData.datasets[0].backgroundColor[index],
                      marginRight: '10px'
                    }}
                  />
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    {label}: {chartData.datasets[0].data[index]}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          {/* Insights */}
          <Typography
            variant="body1"
            style={{
              marginTop: '1rem',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              lineHeight: '1.5',
            }}
            dangerouslySetInnerHTML={{ __html: insights }} // Render highlighted text
          />
        </Paper>
      </Container>
    </div>
  );
};

export default OverallClassEngagement;

