import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { deleteEmployee, getEmployees } from '../services/employeeService';
import { AuthContext } from '../context/AuthContext';

const EmployeeList = () => {
  const [employees, setEmployees] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem('currentUser');

  const loadEmployees = async () => {
    if (user && employees === null) {  // Fetch only if employees list is empty
      try {
        setLoading(true);  // Set loading to true before fetching data
        const employeeData = await getEmployees();
        setEmployees(employeeData);
      } catch (err) {
        console.error('Failed to load employees', err);
      } finally {
        setLoading(false);  // Set loading to false once data is fetched
      }
    }
  };

  useEffect(() => {
    if (user && employees === null) {  // Check for user and empty employees
      loadEmployees();
    }
  }, [user, employees]);  // Trigger useEffect when `user` or employees.length changes

  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      // Re-fetch employees after deleting
      loadEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
    }
  };

  if (loading) return <div className="text-center my-5">Loading employees...</div>;

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4">Employees</h2>
        <div>
          <Link to="/employees/new" className="btn btn-primary">
            Add Employee
          </Link>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{employee.department}</td>
                <td>{employee.position}</td>
                <td>{employee.status}</td>
                <td>
                  <Link
                    to={`/employees/${employee._id}`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
