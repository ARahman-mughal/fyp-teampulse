import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { createProject } from '../services/projectService';
import { getEmployees } from '../services/employeeService';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Not Started',
    employees: []
  });
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployees(data);
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(formData);
      navigate('/projects');
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, employees: selectedOptions });
  };

  return (
    <div className="container mt-4">
      <h2>Add New Project</h2>
      <Form onSubmit={handleSubmit}>
        {/* Project Name */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>Project Name</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        {/* Description */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>Description</Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        {/* Start Date */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>Start Date</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        {/* End Date */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>End Date</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        {/* Status */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>Status</Form.Label>
          <Col sm={10}>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Employees */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>Team Members</Form.Label>
          <Col sm={10}>
            <Form.Select 
              multiple 
              onChange={handleEmployeeSelect}
              value={formData.employees}
            >
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        {/* Submit */}
        <Button variant="primary" type="submit">
          Create Project
        </Button>
      </Form>
    </div>
  );
};

export default ProjectForm;
