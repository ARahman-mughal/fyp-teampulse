import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { getAttendanceHistory, getAttendanceStatus, clockIn, clockOut } from '../services/attendanceService';

const AttendanceTracker = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clockedIn, setClockedIn] = useState(false);

  useEffect(() => {
    fetchAttendance();
    checkCurrentStatus();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await getAttendanceHistory();
      setAttendance(response);
      setLoading(false);
    } catch (error) {
      setError('Error fetching attendance history');
      setLoading(false);
    }
  };

  const checkCurrentStatus = async () => {
    try {
      const response = await getAttendanceStatus();
      setClockedIn(response.clockedIn);
    } catch (error) {
      console.error('Error checking attendance status:', error);
    }
  };

  const handleClockInOut = async () => {
    try {
      if (clockedIn) {
        await clockOut();
      } else {
        await clockIn();
      }
      setClockedIn(!clockedIn);
      fetchAttendance();
    } catch (error) {
      setError('Error updating attendance');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {clockedIn ? 'Currently Clocked In' : 'Not Clocked In'}
            </Typography>
            <Button
              variant="contained"
              color={clockedIn ? 'secondary' : 'primary'}
              onClick={handleClockInOut}
            >
              {clockedIn ? 'Clock Out' : 'Clock In'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Attendance History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Clock In</TableCell>
                    <TableCell>Clock Out</TableCell>
                    <TableCell>Total Hours</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendance.map((record) => {
                    const clockIn = new Date(record.clockIn);
                    const clockOut = record.clockOut ? new Date(record.clockOut) : null;
                    const totalHours = clockOut
                      ? ((clockOut - clockIn) / (1000 * 60 * 60)).toFixed(2)
                      : '-';

                    return (
                      <TableRow key={record._id}>
                        <TableCell>{format(clockIn, 'yyyy-MM-dd')}</TableCell>
                        <TableCell>{format(clockIn, 'HH:mm:ss')}</TableCell>
                        <TableCell>
                          {clockOut ? format(clockOut, 'HH:mm:ss') : '-'}
                        </TableCell>
                        <TableCell>{totalHours}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AttendanceTracker; 