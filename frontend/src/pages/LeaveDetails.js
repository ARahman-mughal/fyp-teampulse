import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Badge, Alert } from 'react-bootstrap';
import { getLeaveById, updateLeave } from '../services/leaveService';
import { useAuth } from '../hooks/useAuth';

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leave, setLeave] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeave = async () => {
      try {
        const data = await getLeaveById(id);
        setLeave(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load leave request');
      } finally {
        setLoading(false);
      }
    };
    loadLeave();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedLeave = await updateLeave(id, { status: newStatus });
      setLeave(updatedLeave);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update leave status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;
  if (!leave) return <Alert variant="warning">Leave request not found</Alert>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Leave Request Details</h3>
          <Badge bg={
            leave.status === 'approved' ? 'success' :
            leave.status === 'rejected' ? 'danger' :
            'warning'
          }>
            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Employee:</strong> {leave.employeeName}</p>
              <p><strong>Leave Type:</strong> {leave.leaveType}</p>
              <p><strong>Start Date:</strong> {new Date(leave.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(leave.endDate).toLocaleDateString()}</p>
            </Col>
            <Col md={6}>
              <p><strong>Reason:</strong></p>
              <p>{leave.reason}</p>
            </Col>
          </Row>

          {user?.role === 'admin' && leave.status === 'pending' && (
            <div className="mt-3">
              <Button
                variant="success"
                className="me-2"
                onClick={() => handleStatusUpdate('approved')}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                onClick={() => handleStatusUpdate('rejected')}
              >
                Reject
              </Button>
            </div>
          )}

          <div className="mt-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/leaves')}
            >
              Back to List
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LeaveDetails;