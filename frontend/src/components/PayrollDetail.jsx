import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPayrollById, updatePayrollStatus } from '../services/payrollService';

const PayrollDetail = () => {
  const { id } = useParams();
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const response = await getPayrollById(id);
        setPayroll(response.data);
        setStatus(response.data?.status);
      } catch (error) {
        console.error('Error fetching payroll:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, [id]);

  console.log({ payroll })

  const handleStatusChange = async () => {
    try {
      const updatedPayroll = await updatePayrollStatus(id, status);
      setPayroll(updatedPayroll.data);
    } catch (error) {
      console.error('Error updating payroll status:', error);
    }
  };

  if (loading) return <div className="text-center my-4">Loading payroll details...</div>;
  if (!payroll) return <div className="text-center my-4 text-danger">Payroll not found</div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Payroll Details</h2>
        <Link to="/payrolls" className="btn btn-outline-primary">
          Back to Payrolls
        </Link>
      </div>

      <div className="card shadow mb-4">
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <h5 className="mb-2">Employee Information</h5>
              {console.log('hello', { payroll})}
              <p className="mb-1 fw-semibold">{payroll.employee.firstName} {payroll.employee.lastName}</p>
              <p className="mb-1 text-muted">{payroll.employee.position}</p>
              <p className="text-muted">{payroll.employee.department} Department</p>
            </div>

            <div className="col-md-6">
              <h5 className="mb-2">Pay Period</h5>
              <p>
                {new Date(payroll.payPeriod.startDate).toLocaleDateString()} -{' '}
                {new Date(payroll.payPeriod.endDate).toLocaleDateString()}
              </p>
              <div className="mt-3">
                <label className="form-label">Status</label>
                <div className="d-flex align-items-center">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-select me-2"
                    style={{ maxWidth: '200px' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Paid">Paid</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button onClick={handleStatusChange} className="btn btn-primary">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          <h5 className="mb-3">Salary Breakdown</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="p-3 border rounded bg-light">
                <small className="text-muted">Basic Salary</small>
                <div className="fs-5 fw-bold">${payroll.basicSalary.toFixed(2)}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border rounded bg-success bg-opacity-10">
                <small className="text-success">Total Allowances</small>
                <div className="fs-5 fw-bold text-success">
                  +${payroll.allowances.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border rounded bg-danger bg-opacity-10">
                <small className="text-danger">Total Deductions</small>
                <div className="fs-5 fw-bold text-danger">
                  -${payroll.deductions.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 border rounded bg-primary bg-opacity-10 mb-4">
            <small className="text-primary">Net Pay</small>
            <div className="fs-3 fw-bold text-primary">${payroll.netPay.toFixed(2)}</div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h5 className="mb-2">Allowances</h5>
              <ul className="list-group mb-4">
                {payroll.allowances.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{item.name}</span>
                    <span className="text-success">+${item.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-md-6">
              <h5 className="mb-2">Deductions</h5>
              <ul className="list-group">
                {payroll.deductions.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between">
                    <span>{item.name}</span>
                    <span className="text-danger">-${item.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetail;
