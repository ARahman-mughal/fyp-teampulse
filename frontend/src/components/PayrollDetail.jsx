import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { getPayrollById } from '../services/payrollService';

const PayrollDetail = () => {
  const { id } = useParams();
  const [payroll, setPayroll] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPayroll = async () => {
      try {
        const data = await getPayrollById(id);
        setPayroll(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load payroll');
      } finally {
        setLoading(false);
      }
    };
    loadPayroll();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!payroll) return <div>Payroll not found</div>;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h3>Payroll Details</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>Employee Name:</strong> {payroll.employeeName}</p>
              <p><strong>Employee ID:</strong> {payroll.employeeId}</p>
              <p><strong>Month:</strong> {new Date(payroll.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </Col>
            <Col md={6}>
              <p><strong>Basic Salary:</strong> ${payroll.basicSalary}</p>
              <p><strong>Allowances:</strong> ${payroll.allowances}</p>
              <p><strong>Deductions:</strong> ${payroll.deductions}</p>
              <p><strong>Net Salary:</strong> ${payroll.netSalary}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PayrollDetail;
