import API from './api';


export const getPayrolls = async () => {
  const response = await API.get('/payrolls');
  return response.data;
};

export const getEmployeePayrolls = async (employeeId) => {
  const response = await API.get(`/payrolls/employee/${employeeId}`);
  return response.data;
};

export const updatePayrollStatus = async (id, status) => {
  const response = await API.put(`/payrolls/${id}/status`, { status });
  return response.data;
};

export const deletePayroll = async (id) => {
  const response = await API.delete(`/payrolls/${id}`);
  return response.data;
};

export const getPayrollById = async (id) => {
  const response = await API.get(`/payrolls/${id}`);
  return response.data;
};
export const createPayroll = async (payrollData) => {
    try {
      const response = await API.post('/payrolls', payrollData);
      return response.data;
    } catch (error) {
      console.error('Error creating payroll:', error);
      throw error;
    }
  };