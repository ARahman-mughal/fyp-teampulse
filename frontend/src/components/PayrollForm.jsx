import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPayroll } from '../services/payrollService';
import { getEmployees } from '../services/employeeService';

const PayrollForm = () => {
  const [formData, setFormData] = useState({
    employee: '',
    payPeriod: { startDate: '', endDate: '' },
    basicSalary: '',
    allowances: [{ name: '', amount: '' }],
    deductions: [{ name: '', amount: '' }]
  });
  const [netPay, setNetPay] = useState(0);
  const [employees, setEmployees] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = localStorage.getItem('currentUser');

  const loadEmployees = async () => {
    if (user && employees === null) {
      try {
        setLoading(true);
        const employeeData = await getEmployees();
        setEmployees(employeeData);
      } catch (err) {
        console.error('Failed to load employees', err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && employees === null) {
      loadEmployees();
    }
  }, [user, employees]);

  useEffect(() => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const totalAllowances = formData.allowances.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalDeductions = formData.deductions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    setNetPay(basic + totalAllowances - totalDeductions);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePeriodChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      payPeriod: { ...prev.payPeriod, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payrollData = {
        ...formData,
        basicSalary: parseFloat(formData.basicSalary),
        allowances: formData.allowances.map(item => ({
          name: item.name,
          amount: parseFloat(item.amount)
        })),
        deductions: formData.deductions.map(item => ({
          name: item.name,
          amount: parseFloat(item.amount)
        })),
        netPay
      };
      await createPayroll(payrollData);
      navigate('/payrolls');
    } catch (error) {
      console.error('Failed to create payroll:', error);
    }
  };

  if (loading) return <div className="text-center my-4">Loading employees...</div>;

  return (
    <div className="container my-5">
      <h2 className="mb-4">Generate Payroll</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        {/* Employee */}
        <div className="mb-3">
          <label className="form-label">Employee</label>
          <select
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Basic Salary */}
        <div className="mb-3">
          <label className="form-label">Basic Salary</label>
          <input
            type="number"
            name="basicSalary"
            value={formData.basicSalary}
            onChange={handleChange}
            className="form-control"
            placeholder="0.00"
            required
          />
        </div>

        {/* Pay Period */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Pay Period Start</label>
            <input
              type="date"
              name="startDate"
              value={formData.payPeriod.startDate}
              onChange={handlePeriodChange}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <label className="form-label">Pay Period End</label>
            <input
              type="date"
              name="endDate"
              value={formData.payPeriod.endDate}
              onChange={handlePeriodChange}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Allowances */}
        <div className="mb-4">
          <label className="form-label">Allowances</label>
          {formData.allowances.map((item, index) => (
            <div className="row mb-2" key={index}>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Allowance name"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...formData.allowances];
                    updated[index].name = e.target.value;
                    setFormData({ ...formData, allowances: updated });
                  }}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => {
                    const updated = [...formData.allowances];
                    updated[index].amount = e.target.value;
                    setFormData({ ...formData, allowances: updated });
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() =>
              setFormData({ ...formData, allowances: [...formData.allowances, { name: '', amount: '' }] })
            }
          >
            Add Allowance
            Add Allowance
            Add Allowance
          </button>
        </div>


        {/* Deductions */}
        <div className="mb-4">
          <label className="form-label">Deductions</label>
          {formData.deductions.map((item, index) => (
            <div className="row mb-2" key={index}>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Deduction name"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...formData.deductions];
                    updated[index].name = e.target.value;
                    setFormData({ ...formData, deductions: updated });
                  }}
                />
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => {
                    const updated = [...formData.deductions];
                    updated[index].amount = e.target.value;
                    setFormData({ ...formData, deductions: updated });
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() =>
              setFormData({ ...formData, deductions: [...formData.deductions, { name: '', amount: '' }] })
            }
          >
            Add Deduction
          </button>
        </div>

        {/* Payroll Summary */}
        <div className="mb-4 border-top pt-3">
          <h5>Payroll Summary</h5>
          <p><strong>Basic Salary:</strong> ${parseFloat(formData.basicSalary || 0).toFixed(2)}</p>
          <p><strong>Total Allowances:</strong> ${formData.allowances.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)}</p>
          <p><strong>Total Deductions:</strong> ${formData.deductions.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)}</p>
          <p><strong>Net Pay:</strong> ${netPay.toFixed(2)}</p>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-success w-100">
          Generate Payroll
        </button>
      </form>
    </div>
  );
};

export default PayrollForm;
