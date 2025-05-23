import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const LeaveRequest = () => {
  const [leaveData, setLeaveData] = useState({
    startDate: null,
    endDate: null,
    leaveType: '',
    reason: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Personal Leave',
    'Maternity/Paternity Leave',
    'Unpaid Leave',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/leave/request', leaveData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbar({
        open: true,
        message: 'Leave request submitted successfully!',
        severity: 'success',
      });
      setLeaveData({
        startDate: null,
        endDate: null,
        leaveType: '',
        reason: '',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error submitting leave request',
        severity: 'error',
      });
    }
  };

  const handleChange = (field) => (value) => {
    setLeaveData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Submit Leave Request
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={leaveData.startDate}
                  onChange={handleChange('startDate')}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  disablePast
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={leaveData.endDate}
                  onChange={handleChange('endDate')}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                  disablePast
                  minDate={leaveData.startDate}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Leave Type"
                  value={leaveData.leaveType}
                  onChange={(e) => handleChange('leaveType')(e.target.value)}
                  fullWidth
                  required
                >
                  {leaveTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Reason"
                  value={leaveData.reason}
                  onChange={(e) => handleChange('reason')(e.target.value)}
                  fullWidth
                  required
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  Submit Request
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default LeaveRequest; 