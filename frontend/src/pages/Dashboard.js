import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjectStats } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { getEmployeeStats } from '../services/employeeService';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([])
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user) return;
        setLoading(true);
        setError(null);
        const response = await getProjectStats();
        setProjects(response);

        console.log(response)
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load projects.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        if (!user) return;
        setLoading(true);
        setError(null);
        const response = await getEmployeeStats();
        setEmployees(response)
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load projects.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    fetchEmployees();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'On Hold': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Dashboard</h2>
        </div>
        {isAdmin && (
          <div className="col text-end">
            <Link to="/projects/new" className="btn btn-primary">
              <i className="fas fa-plus me-2"></i>Add Project
            </Link>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      <div className="row g-4">
        {/* Common card styles */}
        <style>
          {`
            .dashboard-card {
              height: 250px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .dashboard-scroll {
              overflow-y: auto;
              max-height: 170px;
            }
            .dashboard-scroll::-webkit-scrollbar {
              width: 6px;
            }
            .dashboard-scroll::-webkit-scrollbar-thumb {
              background-color: #ccc;
              border-radius: 4px;
            }
          `}
        </style>

        {/* All Projects */}
        <div className="col-md-6 col-lg-3">
          <div className="card dashboard-card shadow-sm bg-dark text-white">
            <div className="card-body">
              <h5 className="card-title">All Projects</h5>
              <p className="display-6">{projects.totalProjects}</p>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="col-md-6 col-lg-3">
          <div className="card dashboard-card shadow-sm bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Active Projects</h5>
              <p className="display-6">{projects.activeProjects}</p>
            </div>
          </div>
        </div>

        {/* Recent Projects (Scrollable) */}
        <div className="col-md-6 col-lg-3">
          <div className="card dashboard-card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Recent Projects</h5>
              <div className="dashboard-scroll">
                {projects?.recentQuarterProjects?.count ? projects.recentQuarterProjects.projects.map((p) => (
                  <div key={p._id} className="mb-2">
                    <Link to={`/projects/${p._id}`} className="fw-semibold text-decoration-none d-block">
                      {p.name}
                    </Link>
                    <span className={`badge bg-${getStatusColor(p.status)}`}>{p.status}</span>
                  </div>
                )) : (
                  <p className="text-muted">No recent projects.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* New Employees (Scrollable Dummy) */}
        <div className="col-md-6 col-lg-3">
          <div className="card dashboard-card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">New Employees</h5>
              <div className="dashboard-scroll">
                {employees.map((emp, idx) => (
                  <div key={idx} className="mb-2">
                    <strong>{emp.name}</strong><br />
                    <small>{emp.role} — {emp.joined}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
