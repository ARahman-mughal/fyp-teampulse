import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import { useGetUsersQuery } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const EmployeeList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: users, error, isLoading } = useGetUsersQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">Error: {error.message}</Alert>;

  // Filter employees based on role
  const employees = users?.filter(u => u.role === 'employee');

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employees</h2>
        {user?.role === 'admin' && (
          <Button variant="primary" onClick={() => navigate('/employees/new')}>
            Add New Employee
          </Button>
        )}
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Position</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.firstName} {employee.lastName}</td>
              <td>{employee.department}</td>
              <td>{employee.position}</td>
              <td>{employee.email}</td>
              <td>{employee.phoneNumber}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => navigate(`/employees/${employee._id}`)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default EmployeeList; 