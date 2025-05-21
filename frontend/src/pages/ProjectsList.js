import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import { getProjects } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load projects');
        console.error('API Error:', err.response);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Projects</h2>
          <Link to="/projects/new" className="btn btn-primary">
            Add Project
          </Link>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          {error}
          <Button variant="outline-danger" size="sm" className="ms-3" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Alert>
      )}

      {projects.length > 0 ? (
        <Table striped bordered hover responsive className="mt-3">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>
                  <Link to={`/projects/${project._id}`}>{project.name}</Link>
                </td>
                <td>{project.description || '-'}</td>
                <td>
                  <span className={`badge bg-${getStatusVariant(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Link
                      to={`/projects/${project._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View
                    </Link>
                    {isAdmin && (
                      <Link
                        to={`/projects/${project._id}/edit`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Edit
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div className="text-center py-5 border rounded">
          <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
          <h4>No Projects Found</h4>
          <p className="text-muted mb-4">Get started by creating your first project</p>
          <Link to="/projects/new" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Create Project
          </Link>
        </div>
      )}
    </div>
  );
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'In Progress': return 'primary';
    case 'On Hold': return 'warning';
    default: return 'secondary';
  }
};

export default ProjectsList;