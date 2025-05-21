import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
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
  const [formLoading, setFormLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [employeeData, projectData] = await Promise.all([
          getEmployees(),
          id ? getProjectById(id) : Promise.resolve(null)
        ]);
        setEmployees(employeeData);
        if (projectData) setProject(projectData);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load data');
        console.error('Form load error:', err);
      } finally {
        setFormLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setProject(prev => ({ ...prev, employees: selected }));
  };

  const validateForm = () => {
    if (!project.name || !project.startDate) {
      return 'Project Name and Start Date are required.';
    }
    if (project.endDate && project.endDate < project.startDate) {
      return 'End Date cannot be earlier than Start Date.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMsg = validateForm();
    if (validationMsg) {
      setValidationError(validationMsg);
      return;
    }

    try {
      setLoading(true);
      setValidationError(null);
      setError(null);

      const payload = {
        ...project,
        createdBy: user._id
      };

      if (id) {
        await updateProject(id, payload);
      } else {
        await createProject(payload);
      }

      navigate('/projects', {
        state: { success: `Project ${id ? 'updated' : 'created'} successfully!` }
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save project');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading form...</p>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <h2 className="mb-4">{id ? 'Edit Project' : 'Create New Project'}</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {validationError && <Alert variant="warning">{validationError}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md={6}>
            <Form.Label>Project Name *</Form.Label>
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
            name="description"
            rows={3}
            value={project.description}
            onChange={handleChange}
            placeholder="Enter a brief description of the project..."
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} md={6}>
            <Form.Label>Start Date *</Form.Label>
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
          <Form.Label>Assign Team Members</Form.Label>
          <Form.Select
            multiple
            name="employees"
            value={project.employees}
            onChange={handleEmployeeSelect}
          >
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProjectForm;
