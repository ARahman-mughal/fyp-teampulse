import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { createPayroll } from '../services/payrollService';
import { getUsers } from '../services/userService';

const PayrollForm = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    employeeId: '',
    month: '',
    basicSalary: '',
    allowances: '',
    deductions: '',
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payrollData = {
        ...formData,
        basicSalary: parseFloat(formData.basicSalary),
        allowances: parseFloat(formData.allowances),
        deductions: parseFloat(formData.deductions),
        netSalary: parseFloat(formData.basicSalary) + parseFloat(formData.allowances) - parseFloat(formData.deductions)
      };

      await createPayroll(payrollData);
      navigate('/payrolls');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payroll');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="mt-4">
      <h2>Create New Payroll</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Employee</Form.Label>
          <Form.Select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName} - {user.department}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Month</Form.Label>
          <Form.Control
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Basic Salary</Form.Label>
              <Form.Control
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Allowances</Form.Label>
              <Form.Control
                type="number"
                name="allowances"
                value={formData.allowances}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Deductions</Form.Label>
              <Form.Control
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Create Payroll
        </Button>
      </Form>
    </Container>
  );
};

export default PayrollForm;
