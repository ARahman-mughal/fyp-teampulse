import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPayrolls, deletePayroll } from '../services/payrollService';

const PayrollList = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const response = await getPayrolls();
        setPayrolls(response.data);
      } catch (error) {
        console.error('Error fetching payrolls:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayrolls();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      try {
        await deletePayroll(id);
        setPayrolls(payrolls.filter(payroll => payroll._id !== id));
      } catch (error) {
        console.error('Error deleting payroll:', error);
      }
    }
  };

  if (loading) return <div className="text-center my-4">Loading payrolls...</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4">Payroll Records</h2>
        <div>
          <Link to="/payrolls/new" className="btn btn-primary me-2">
            Generate Payroll
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>Employee</th>
              <th>Pay Period</th>
              <th>Basic Salary</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((payroll) => (
              <tr key={payroll._id}>
                <td>{payroll.employee?.firstName} {payroll.employee?.lastName}</td>
                <td>
                  {new Date(payroll.payPeriod.startDate).toLocaleDateString()} -{' '}
                  {new Date(payroll.payPeriod.endDate).toLocaleDateString()}
                </td>
                <td>${payroll.basicSalary.toFixed(2)}</td>
                <td>${payroll.netPay.toFixed(2)}</td>
                <td>
                  <span className={`badge rounded-pill ${
                    payroll.status === 'Paid' ? 'bg-success' :
                    payroll.status === 'Approved' ? 'bg-primary' :
                    payroll.status === 'Rejected' ? 'bg-danger' :
                    'bg-warning text-dark'
                  }`}>
                    {payroll.status}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/payrolls/${payroll._id}`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(payroll._id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {payrolls.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No payroll records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollList;
