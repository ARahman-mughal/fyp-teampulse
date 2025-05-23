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
  Box,
  TextField,
  MenuItem,
} from '@mui/material';

const Payroll = () => {
  // This is a placeholder. In a real app, you would fetch this data from your API
  const payrollRecords = [
    {
      id: 1,
      employeeName: 'John Doe',
      month: 'March 2024',
      basicSalary: 5000,
      allowances: 1000,
      deductions: 500,
      netSalary: 5500,
      status: 'Paid',
    },
  ];

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Payroll Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
          >
            Generate Payroll
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            select
            label="Month"
            defaultValue="March 2024"
            sx={{ mr: 2, minWidth: 200 }}
          >
            <MenuItem value="March 2024">March 2024</MenuItem>
            <MenuItem value="February 2024">February 2024</MenuItem>
            <MenuItem value="January 2024">January 2024</MenuItem>
          </TextField>

          <TextField
            select
            label="Status"
            defaultValue="all"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Month</TableCell>
                <TableCell align="right">Basic Salary</TableCell>
                <TableCell align="right">Allowances</TableCell>
                <TableCell align="right">Deductions</TableCell>
                <TableCell align="right">Net Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payrollRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.employeeName}</TableCell>
                  <TableCell>{record.month}</TableCell>
                  <TableCell align="right">
                    ${record.basicSalary.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ${record.allowances.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ${record.deductions.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ${record.netSalary.toLocaleString()}
                  </TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                    >
                      Download
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

export default Payroll; 