import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation ,useNavigate} from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
const navigate=useNavigate();
  const location = useLocation();
  const username = location?.state?.username;

  // Fetch data based on the username
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (username) {
          const response = await axios.get(`http://localhost:5000/api/user/data?username=${username}`);
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [username]);

  // Handle panel expansion
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
    const handleLogout = () => {
      // Clear localStorage or any other client-side session storage
      localStorage.removeItem('authToken');
      navigate('/login');
    };
    // Handle dropdown toggle
    const toggleDropdown = (index) => {
      setDropdownOpen(dropdownOpen === index ? null : index);
    };

    // Handle menu toggle (hamburger)
    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };

    if (!userData) {
      return <div>Loading...</div>;
    }

    return (
      <Box sx={{ flexGrow: 1 }}>
        {/* AppBar */}
        <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {userData.username}'s Dashboard
            </Typography>
            <Button color="inherit" startIcon={<RefreshIcon />}>
              Refresh
            </Button>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Sections
          </Typography>
          {userData.sections.map((section, index) => (
            <Accordion
              key={section._id}
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{ mb: 2 }}
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
                  {section.subjects.map((subject) => (
                    <ListItem key={subject}>
                      <ListItemText primary={subject} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>
    );
  };

  export default Dashboard;
