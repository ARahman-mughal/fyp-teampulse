import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../hooks/useEmployees';
import {
  createEmployee,
  updateEmployee,
  getEmployeeById,
} from '../services/employeeService';

const EmployeeForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addEmployee, updateEmployee: updateEmployeeContext } = useEmployees();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'IT',
    position: '',
    status: 'Active',
  });

  useEffect(() => {
    if (isEdit) {
      const fetchEmployee = async () => {
        try {
          const employee = await getEmployeeById(id);
          setFormData({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            department: employee.department,
            position: employee.position,
            status: employee.status,
          });
        } catch (err) {
          console.error('Failed to fetch employee', err);
        }
      };
      fetchEmployee();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        const updatedEmployee = await updateEmployee(id, formData);
        updateEmployeeContext(updatedEmployee);
      } else {
        const newEmployee = await createEmployee(formData);
        addEmployee(newEmployee);
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to save employee', err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="form-select"
              >
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Terminated">Terminated</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Update Employee' : 'Add Employee'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;
