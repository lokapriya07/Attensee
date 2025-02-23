import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from 'react-router-dom';
import { useTeacherContext } from './teachercontext';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Dashboard() {
  const { teacherData, fetchTeacherData, logout } = useTeacherContext();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleViewSubject = (section, subject) => {
    navigate(`/upload-video/${section}/${subject}`);
  };

  const handleViewReport = (section) => {
    navigate(`/reports`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {teacherData?.username}'s Dashboard
          </Typography>
          <Button color="inherit" onClick={fetchTeacherData} startIcon={<RefreshIcon />}>
            Refresh
          </Button>
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sections
        </Typography>
        {teacherData?.sections.map((section, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            {/* Accordion Dropdown */}
            <Accordion
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{ flexGrow: 1 }} // Allow the accordion to expand and fill space
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                  {section.name}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  {section.subjects.length} subjects
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {section.subjects.map((subject, subIndex) => (
                    <ListItem key={subIndex}>
                      <ListItemText
                        primary={
                          <Link
                            to={`/upload-video/${section.name}/${subject}`}
                            style={{
                              textDecoration: 'none',
                              color: '#1976d2',
                              fontWeight: 'bold',
                            }}
                          >
                            {subject}
                          </Link>
                        }
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewSubject(section.name, subject)}
                      >
                        View
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            {/* View Reports Button */}
            <Button
              variant="contained"
              onClick={() => handleViewReport(section.name)}
              sx={{
                ml: 2,
                fontWeight: 'bold',
                borderRadius: '8px', // Rounded corners for a soft look
                padding: '6px 16px', // Comfortable padding
                backgroundColor: '#b9fbc0', // Light green color for the button
                color: '#1b5e20', // Dark green text for contrast
                textTransform: 'capitalize', // Modern and clean text style
                fontSize: '14px', // Readable font size
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                '&:hover': {
                  backgroundColor: '#98ee99', // Slightly darker green for hover
                },
                '&:active': {
                  backgroundColor: '#66bb6a', // A deeper green for active state
                },
                '&:focus': {
                  outline: '2px solid #66bb6a', // Add a focus ring for accessibility
                },
              }}
            >
              View Reports
            </Button>

          </Box>
        ))}
      </Container>
    </Box>
  );
}

