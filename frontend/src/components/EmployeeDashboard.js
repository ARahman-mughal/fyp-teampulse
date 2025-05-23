import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../services/employeeService';

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await getDashboardData();
        setEmployeeData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Profile Summary
            </Typography>
            {employeeData && (
              <>
                <Typography>Name: {employeeData.name}</Typography>
                <Typography>Employee ID: {employeeData.employeeId}</Typography>
                <Typography>Department: {employeeData.department}</Typography>
                <Typography>Position: {employeeData.position}</Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/leave-request')}
                >
                  Request Leave
                </Button>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/attendance')}
                >
                  View Attendance
                </Button>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/payslips')}
                >
                  View Payslips
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            {employeeData?.recentActivities?.map((activity, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  {activity.date} - {activity.description}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployeeDashboard; 