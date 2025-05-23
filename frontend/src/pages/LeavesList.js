import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import { getLeaves } from '../services/leaveService';
import { useAuth } from '../hooks/useAuth';

const LeavesList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const data = await getLeaves();
        setLeaves(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load leaves');
      } finally {
        setLoading(false);
      }
    };
    loadLeaves();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  // Filter leaves based on user role
  const filteredLeaves = user?.role === 'admin' 
    ? leaves 
    : leaves.filter(leave => leave.employeeId === user?._id);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Leave Requests</h2>
        <Button variant="primary" onClick={() => navigate('/leaves/new')}>
          New Leave Request
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map((leave) => (
            <tr key={leave._id}>
              <td>{leave.employeeName}</td>
              <td>{leave.leaveType}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>
                <span className={`badge bg-${
                  leave.status === 'approved' ? 'success' :
                  leave.status === 'rejected' ? 'danger' :
                  'warning'
                }`}>
                  {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                </span>
              </td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => navigate(`/leaves/${leave._id}`)}
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

export default LeavesList;