import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { getEmployees } from '../services/employeeService';
import { createProject, getProjectById, updateProject } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const ProjectForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [project, setProject] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Planning',
    employees: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [employeeData, projectData] = await Promise.all([
          getEmployees(),
          id ? getProjectById(id) : null
        ]);

        setEmployees(employeeData);
        if (projectData) setProject(projectData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load form data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (e) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setProject(prev => ({ ...prev, employees: options }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const projectData = {
        ...project,
        createdBy: user._id // Ensure project has creator
      };

      if (id) {
        await updateProject(id, projectData);
      } else {
        await createProject(projectData);
      }
      
      navigate('/projects', { state: { success: `Project ${id ? 'updated' : 'created'} successfully!` }});
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">{id ? 'Edit Project' : 'New Project'}</h2>
      
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md={6}>
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={project.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={6}>
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={project.status}
              onChange={handleChange}
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={project.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} md={6}>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={project.startDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={6}>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={project.endDate}
              onChange={handleChange}
              min={project.startDate}
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-4">
          <Form.Label>Team Members</Form.Label>
          <Form.Select 
            multiple 
            onChange={handleEmployeeSelect}
            value={project.employees}
          >
            {employees.map(employee => (
              <option key={employee._id} value={employee._id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProjectForm;