import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import store from './store';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './components/Layout/MainLayout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LeaveRequests from './pages/LeaveRequests';
import Employees from './pages/Employees';
import Projects from './pages/Projects';
import Payroll from './pages/Payroll';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="leave-requests" element={<LeaveRequests />} />
              <Route path="employees" element={<Employees />} />
              <Route path="projects" element={<Projects />} />
              <Route path="payroll" element={<Payroll />} />
            </Route>

            {/* Catch all - replace with 404 page if needed */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;