import React from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Avatar,
} from '@mui/material';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <Container>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 150,
                height: 150,
                margin: '0 auto',
                bgcolor: 'primary.main',
                fontSize: '4rem',
              }}
            >
              {user.firstName?.[0] || user.email[0]}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Profile Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Name:</strong> {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Role:</strong> {user.role}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Department:</strong> {user.department}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Position:</strong> {user.position}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Join Date:</strong>{' '}
                {new Date(user.joinDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 