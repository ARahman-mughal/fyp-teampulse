import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Badge, Alert } from 'react-bootstrap';
import { getProjectById, updateProject } from '../services/projectService';
import { useAuth } from '../hooks/useAuth';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedProject = await updateProject(id, { status: newStatus });
      setProject(updatedProject);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;
  if (!project) return <Alert variant="warning">Project not found</Alert>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>{project.name}</h3>
          <div>
            <Badge bg={
              project.status === 'completed' ? 'success' :
              project.status === 'in_progress' ? 'primary' :
              project.status === 'on_hold' ? 'warning' :
              'secondary'
            } className="me-2">
              {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            <Badge bg={
              project.priority === 'high' ? 'danger' :
              project.priority === 'medium' ? 'warning' :
              'info'
            }>
              {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h5>Description</h5>
              <p>{project.description}</p>

              <h5 className="mt-4">Team Members</h5>
              <ul className="list-unstyled">
                {project.teamMembers.map((member, index) => (
                  <li key={member._id || index}>
                    {member.firstName} {member.lastName} - {member.department}
                  </li>
                ))}
              </ul>
            </Col>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Body>
                  <h6>Project Details</h6>
                  <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Budget:</strong> ${project.budget}</p>
                </Card.Body>
              </Card>

              {user?.role === 'admin' && project.status !== 'completed' && (
                <Card>
                  <Card.Body>
                    <h6>Update Status</h6>
                    <div className="d-grid gap-2">
                      {project.status !== 'in_progress' && (
                        <Button
                          variant="primary"
                          onClick={() => handleStatusUpdate('in_progress')}
                        >
                          Start Project
                        </Button>
                      )}
                      {project.status !== 'on_hold' && (
                        <Button
                          variant="warning"
                          onClick={() => handleStatusUpdate('on_hold')}
                        >
                          Put On Hold
                        </Button>
                      )}
                      {project.status !== 'completed' && (
                        <Button
                          variant="success"
                          onClick={() => handleStatusUpdate('completed')}
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>

          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProjectDetails;
