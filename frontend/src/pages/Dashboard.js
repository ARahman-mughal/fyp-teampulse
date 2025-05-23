import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjectStats } from '../services/projectService';
import { getEmployeeStats } from '../services/employeeService';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Alert,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!isAuthenticated) return;
        setLoading(true);
        setError(null);
        const response = await getProjectStats();
        setProjects(response);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load projects.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        if (!isAuthenticated) return;
        setLoading(true);
        setError(null);
        const response = await getEmployeeStats();
        setEmployees(response);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load employees.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    fetchEmployees();
  }, [isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'On Hold': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Dashboard
        </Typography>
        {isAdmin && (
          <Button
            component={Link}
            to="/projects/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Project
          </Button>
        )}
      </Box>

      {error && (
        <Alert
          severity="error"
          action={
            <IconButton
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              <RefreshIcon />
            </IconButton>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* All Projects */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: 'grey.900', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                All Projects
              </Typography>
              <Typography variant="h3">
                {projects.totalProjects || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Projects */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Projects
              </Typography>
              <Typography variant="h3">
                {projects.activeProjects || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Projects */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Projects
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {projects?.recentQuarterProjects?.count ? (
                  projects.recentQuarterProjects.projects.map((p) => (
                    <Box key={p._id} sx={{ mb: 2 }}>
                      <Link
                        to={`/projects/${p._id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          {p.name}
                        </Typography>
                      </Link>
                      <Chip
                        label={p.status}
                        color={getStatusColor(p.status)}
                        size="small"
                      />
                    </Box>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No recent projects.
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* New Employees */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                New Employees
              </Typography>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                {employees.map((emp, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                      {emp.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {emp.role} — {emp.joined}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
