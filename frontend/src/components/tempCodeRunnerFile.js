import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  CircularProgress,
  Button,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ClassContext } from './classcontext';
import { useTeacherContext } from './teachercontext';

const Dashboard = () => {
  const { userData, loading: classLoading } = useContext(ClassContext);
  const { teacherData, fetchTeacherData, logout } = useTeacherContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  if (classLoading || !teacherData) {
    return (
      <Container
        maxWidth="sm"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const drawerContent = (
    <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {['Profile', 'Settings', 'Logout'].map((text) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {teacherData?.username || userData?.username}'s Dashboard
          </Typography>
          <Button color="inherit" onClick={fetchTeacherData} startIcon={<RefreshIcon />}>
            Refresh
          </Button>
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
          {userData && <Avatar>{userData.username[0].toUpperCase()}</Avatar>}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {teacherData?.username || userData?.username}
        </Typography>

        <Typography variant="h5" gutterBottom>
          Sections
        </Typography>
        {(teacherData?.sections || []).map((section, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{ mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>{section.name}</Typography>
              <Typography sx={{ color: 'text.secondary' }}>{section.subjects.length} subjects</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {section.subjects.map((subject, subIndex) => (
                  <ListItem button key={subIndex}>
                    <Link
  to={`/upload-video/${section.name || section._id}/${subject}`}
  style={{ textDecoration: 'none', color: '#1976d2' }}
>
  <ListItem button key={subIndex}>
    <div className="MuiListItemText-root css-cfq8qh-MuiListItemText-root">
      <span className="MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-rizt0-MuiTypography-root">
        {subject}
      </span>
    </div>
  </ListItem>
</Link>

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
