import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  People,
  Assignment,
  AttachMoney,
  Person,
  EventNote,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', showAlways: true },
    { text: 'My Profile', icon: <Person />, path: '/profile', showAlways: true },
    { text: 'Leave Requests', icon: <EventNote />, path: '/leave-requests', showAlways: true },
    { text: 'Employees', icon: <People />, path: '/employees', adminOnly: true },
    { text: 'Projects', icon: <Assignment />, path: '/projects', adminOnly: true },
    { text: 'Payroll', icon: <AttachMoney />, path: '/payroll', adminOnly: true },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1976d2',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          EMS Portal
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
      <List>
        {menuItems.map((item) => {
          // Show item if it's always visible or if user is admin and item is admin-only
          if (item.showAlways || (isAdmin && item.adminOnly)) {
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          }
          return null;
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar; 