import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import { getPayrolls } from '../services/payrollService';

const PayrollList = () => {
  const navigate = useNavigate();
  const [payrolls, setPayrolls] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayrolls = async () => {
      try {
        const data = await getPayrolls();
        setPayrolls(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load payrolls');
      } finally {
        setLoading(false);
      }
    };
    loadPayrolls();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Payroll List</h2>
        <Button variant="primary" onClick={() => navigate('/payrolls/new')}>
          Create New Payroll
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Month</th>
            <th>Basic Salary</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Net Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((payroll) => (
            <tr key={payroll._id}>
              <td>{payroll.employeeName}</td>
              <td>{new Date(payroll.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td>
              <td>${payroll.basicSalary}</td>
              <td>${payroll.allowances}</td>
              <td>${payroll.deductions}</td>
              <td>${payroll.netSalary}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => navigate(`/payrolls/${payroll._id}`)}
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

export default PayrollList;
