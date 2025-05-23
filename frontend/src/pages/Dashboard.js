import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getProjects } from '../services/projectService';
import { getLeaves } from '../services/leaveService';
import { getPayrolls } from '../services/payrollService';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    pendingLeaves: 0,
    totalPayroll: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [projects, leaves, payrolls] = await Promise.all([
          getProjects(),
          getLeaves(),
          getPayrolls()
        ]);

        // Filter data based on user role
        const filteredProjects = user?.role === 'admin' 
          ? projects 
          : projects.filter(project => project.teamMembers.includes(user?._id));

        const filteredLeaves = user?.role === 'admin'
          ? leaves
          : leaves.filter(leave => leave.employeeId === user?._id);

        const filteredPayrolls = user?.role === 'admin'
          ? payrolls
          : payrolls.filter(payroll => payroll.employeeId === user?._id);

        setStats({
          totalProjects: filteredProjects.length,
          activeProjects: filteredProjects.filter(p => p.status === 'in_progress').length,
          pendingLeaves: filteredLeaves.filter(l => l.status === 'pending').length,
          totalPayroll: filteredPayrolls.reduce((sum, p) => sum + p.netSalary, 0)
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Projects</Card.Title>
              <Card.Text className="h2">{stats.totalProjects}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Active Projects</Card.Title>
              <Card.Text className="h2">{stats.activeProjects}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Pending Leaves</Card.Title>
              <Card.Text className="h2">{stats.pendingLeaves}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Payroll</Card.Title>
              <Card.Text className="h2">${stats.totalPayroll.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
