import { createContext, useState, useEffect, useContext } from 'react';
import { getEmployees } from '../services/employeeService';
import { AuthContext } from './AuthContext';

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadEmployees = async () => {
      if (user) {
        try {
          const employeeData = await getEmployees();
          setEmployees(employeeData);
        } catch (err) {
          console.error('Failed to load employees', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadEmployees();
  }, []);

  const addEmployee = (employee) => {
    setEmployees([...employees, employee]);
  };

  const updateEmployee = (updatedEmployee) => {
    setEmployees(
      employees.map((emp) =>
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      )
    );
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter((emp) => emp._id !== id));
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        addEmployee,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};