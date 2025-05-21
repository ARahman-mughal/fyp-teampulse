import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLeavesById } from '../services/leaveService';

const LeaveDetails = () => {
  const [leave, setLeave] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await getLeavesById(id);
        setLeave(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeave();
  }, [id]);

  if (!leave) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Leave Request Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{leave.leaveType} Leave</h5>
          <p className="card-text">
            <strong>Dates:</strong> {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}
          </p>
          <p className="card-text">
            <strong>Status:</strong> 
            <span className={`badge ${leave.status === 'Approved' ? 'bg-success' : leave.status === 'Rejected' ? 'bg-danger' : 'bg-warning'}`}>
              {leave.status}
            </span>
          </p>
          <p className="card-text">
            <strong>Reason:</strong> {leave.reason || 'N/A'}
          </p>
          <Link to="/leaves" className="btn btn-secondary me-2">
            Back
          </Link>
          <Link to={`/leaves/${leave._id}/edit`} className="btn btn-primary">
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;