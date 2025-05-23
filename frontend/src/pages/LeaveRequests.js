import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const LeaveRequests = () => {
  // This is a placeholder. In a real app, you would fetch this data from your API
  const leaveRequests = [
    {
      id: 1,
      type: 'Vacation',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      status: 'Pending',
    },
  ];

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Leave Requests
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
        >
          New Leave Request
        </Button>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.startDate}</TableCell>
                  <TableCell>{request.endDate}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default LeaveRequests; 