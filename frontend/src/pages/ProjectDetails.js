import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById, deleteProject } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjectById(id);
        
        if (!data) {
          throw new Error('Project not found');
        }
        
        setProject(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load project');
        console.error('Project fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      setDeleteLoading(true);
      await deleteProject(id);
      navigate('/projects', { state: { message: 'Project deleted successfully' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
      console.error('Delete error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Present';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="text-center my-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container my-4">
      <div className="alert alert-danger d-flex align-items-center">
        <i className="fas fa-exclamation-circle me-2"></i>
        <div>{error}</div>
        <button 
          className="btn btn-sm btn-outline-danger ms-auto"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
      <Link to="/projects" className="btn btn-outline-secondary">
        Back to Projects
      </Link>
    </div>
  );

  if (!project) return (
    <div className="container my-4">
      <div className="alert alert-warning">
        Project not found
      </div>
      <Link to="/projects" className="btn btn-outline-secondary">
        Back to Projects
      </Link>
    </div>
  );

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">{project.name}</h2>
          <span className={`badge bg-${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        <div>
          <Link to="/projects" className="btn btn-outline-primary me-2">
            Back
          </Link>
          <Link 
            to={`/projects/${id}/edit`} 
            className="btn btn-primary me-2"
          >
            Edit
          </Link>
          <>
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="fas fa-trash me-1"></i> Delete
                </>
              )}
            </button>
          </>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title border-bottom pb-2">Project Details</h5>
          <p className="card-text mt-3">{project.description}</p>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title border-bottom pb-2">Project Dates</h5>
          <p><strong>Start Date:</strong> {formatDate(project.startDate)}</p>
          <p><strong>End Date:</strong> {project.endDate ? formatDate(project.endDate) : 'Present'}</p>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title border-bottom pb-2">Team Members</h5>
          {project.employees?.length > 0 ? (
            <div className="mt-3">
              <ul className="list-group">
                {project.employees.map(employee => (
                  <li key={employee._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0">{employee.firstName} {employee.lastName}</h6>
                      <small className="text-muted">{employee.position || 'No position specified'}</small>
                    </div>
                    <Link 
                      to={`/employees/${employee._id}`} 
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Profile
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="fas fa-users-slash text-muted mb-2" style={{ fontSize: '2rem' }}></i>
              <p className="text-muted">No team members assigned</p>
              {user?.isAdmin && (
                <Link 
                  to={`/projects/${id}/edit`} 
                  className="btn btn-sm btn-primary"
                >
                  <i className="fas fa-plus me-1"></i> Add Members
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch(status) {
    case 'Completed': return 'success';
    case 'In Progress': return 'primary';
    case 'On Hold': return 'warning';
    case 'Cancelled': return 'danger';
    default: return 'secondary';
  }
};

export default ProjectDetails;
