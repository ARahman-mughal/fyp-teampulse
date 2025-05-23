import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import UserList from '../components/UserList';
import UserForm from '../components/UserForm';
import PayrollList from '../components/PayrollList';
import PayrollForm from '../components/PayrollForm';
import PayrollDetail from '../components/PayrollDetail';
import ProjectsList from '../pages/ProjectsList';
import ProjectForm from '../pages/ProjectForm';
import ProjectDetails from '../pages/ProjectDetails';
import LeavesList from '../pages/LeavesList';
import LeaveForm from '../pages/LeaveForm';
import LeaveDetails from '../pages/LeaveDetails';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  console.log({ currentUser })

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <UserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserForm />
              </ProtectedRoute>
            }
          />

          {/* Admin Only - Payroll Routes */}
          <Route
            path="/payrolls"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PayrollList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payrolls/new"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PayrollForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payrolls/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PayrollDetail />
              </ProtectedRoute>
            }
          />

          {/* Admin Only - Project Routes */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProjectsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProjectForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProjectForm />
              </ProtectedRoute>
            }
          />

          {/* Leave Routes - Accessible by all authenticated users */}
          <Route
            path="/leaves"
            element={
              <ProtectedRoute>
                <LeavesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaves/new"
            element={
              <ProtectedRoute>
                <LeaveForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaves/:id"
            element={
              <ProtectedRoute>
                <LeaveDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppRoutes; 