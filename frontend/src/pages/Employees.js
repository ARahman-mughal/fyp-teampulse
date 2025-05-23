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
  Avatar,
  Box,
} from '@mui/material';

const Employees = () => {
  // This is a placeholder. In a real app, you would fetch this data from your API
  const employees = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      department: 'IT',
      position: 'Software Engineer',
      joinDate: '2023-01-15',
    },
  ];

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Employees
          </Typography>
          <Button
            variant="contained"
            color="primary"
          >
            Add Employee
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>
                        {employee.firstName[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="body1">
                          {employee.firstName} {employee.lastName}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {employee.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </TableCell>
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
                      Edit
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

export default Employees; 