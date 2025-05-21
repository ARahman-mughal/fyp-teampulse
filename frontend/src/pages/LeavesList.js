import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getLeaves } from '../services/leaveService';

const LeavesList = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await getLeaves();
        setLeaves(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeaves();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Leave Requests</h2>
      <Link to="/leaves/new" className="btn btn-primary mb-3">
        New Leave Request
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave._id}>
              <td>
                {leave.employeeName || 
                 (leave.employee?.firstName && leave.employee?.lastName ? 
                  `${leave.employee.firstName} ${leave.employee.lastName}` : 
                  'N/A')}
              </td>
              <td>{leave.leaveType}</td>
              <td>{new Date(leave.startDate).toLocaleDateString()}</td>
              <td>{new Date(leave.endDate).toLocaleDateString()}</td>
              <td>
                <span className={`badge ${leave.status === 'Approved' ? 'bg-success' : leave.status === 'Rejected' ? 'bg-danger' : 'bg-warning'}`}>
                  {leave.status}
                </span>
              </td>
              <td>
                <Link to={`/leaves/${leave._id}`} className="btn btn-sm btn-info me-2">
                  View
                </Link>
                <Link to={`/leaves/${leave._id}/edit`} className="btn btn-sm btn-secondary">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeavesList;