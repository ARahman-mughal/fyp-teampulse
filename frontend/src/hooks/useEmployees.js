import { useContext } from 'react';
import { EmployeeContext } from '../context/EmployeeContext';

export const useEmployees = () => {
  return useContext(EmployeeContext);
};