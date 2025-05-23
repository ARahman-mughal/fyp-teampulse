import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Alert, Badge } from 'react-bootstrap';
import { getProjects } from '../services/projectService';
import { useAuth } from '../hooks/useAuth';

const ProjectsList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  // Filter projects based on user role
  const filteredProjects = user?.role === 'admin' 
    ? projects 
    : projects.filter(project => project.teamMembers.includes(user?._id));

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Projects</h2>
        {user?.role === 'admin' && (
          <Button variant="primary" onClick={() => navigate('/projects/new')}>
            Create New Project
          </Button>
        )}
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project._id}>
              <td>{project.name}</td>
              <td>
                <Badge bg={
                  project.status === 'completed' ? 'success' :
                  project.status === 'in_progress' ? 'primary' :
                  project.status === 'on_hold' ? 'warning' :
                  'secondary'
                }>
                  {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </td>
              <td>
                <Badge bg={
                  project.priority === 'high' ? 'danger' :
                  project.priority === 'medium' ? 'warning' :
                  'info'
                }>
                  {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                </Badge>
              </td>
              <td>{new Date(project.startDate).toLocaleDateString()}</td>
              <td>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => navigate(`/projects/${project._id}`)}
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

export default ProjectsList;