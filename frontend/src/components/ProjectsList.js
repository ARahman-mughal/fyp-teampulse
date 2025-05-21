import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="text-center my-5">Loading projects...</div>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Projects</h2>
        {user?.isAdmin && (
          <Link to="/projects/new" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i> Create Project
          </Link>
        )}
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project.name}</td>
                <td>
                  <span className={`badge bg-${getStatusBadgeColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td>{new Date(project.startDate).toLocaleDateString()}</td>
                <td>{project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}</td>
                <td>
                  <Link 
                    to={`/projects/${project._id}`} 
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    <i className="fas fa-eye me-1"></i> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function for status badge colors
const getStatusBadgeColor = (status) => {
  switch(status) {
    case 'Completed': return 'success';
    case 'In Progress': return 'primary';
    case 'On Hold': return 'warning';
    default: return 'secondary';
  }
};

export default ProjectsList;