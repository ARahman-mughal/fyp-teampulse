import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getEmployees } from '../services/employeeService'
import { applyLeave, getLeavesById, updateLeave } from '../services/leaveService';

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    employee: '',
    leaveType: 'Vacation',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'Pending'
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch employees and leave data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employees list
        const empRes = await getEmployees();
        setEmployees(empRes);

        // If editing, fetch leave data
        if (id) {
          const leaveRes = await getLeavesById(id);
          setFormData(leaveRes);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For new leave requests
      if (!id) {
        // Get selected employee details
        const selectedEmployee = employees.find(emp => emp._id === formData.employee);
        const leaveWithEmployee = {
          ...formData,
          employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
        };

        await applyLeave(leaveWithEmployee)
      } else {
        // For editing existing leave
        await updateLeave(id, formData)
      }
      navigate('/leaves');
    } catch (err) {
      console.error('Submission error:', {
        error: err.response?.data || err.message,
        config: err.config
      });
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>{id ? 'Edit' : 'New'} Leave Request</h2>
      <form onSubmit={handleSubmit}>
        {!id && (
          <div className="mb-3">
            <label className="form-label">Employee</label>
            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              className="form-select"
              required={!id}
              disabled={!!id} // Disable for edit mode
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee._id} value={employee._id}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="mb-3">
          <label className="form-label">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="Vacation">Vacation</option>
            <option value="Sick">Sick</option>
            <option value="Personal">Personal</option>
            <option value="Maternity/Paternity">Maternity/Paternity</option>
            <option value="Bereavement">Bereavement</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate?.split('T')[0] || ''}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate?.split('T')[0] || ''}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="form-control"
            rows="3"
          />
        </div>
        
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeaveForm;