import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getEmployees } from '../services/employeeService';
import { createProject, getProjectById, updateProject } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    status: 'Planning',
    budget: '',
    team: [],
  });

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await getProjectById(id);
      setFormData({
        ...response,
        startDate: new Date(response.startDate),
        endDate: response.endDate ? new Date(response.endDate) : null,
      });
      setLoading(false);
    } catch (error) {
      setError('Error fetching project data');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProject(id, formData);
      } else {
        await createProject(formData);
      }
      navigate('/projects');
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving project');
    }
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target ? event.target.value : event,
    });
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            {id ? 'Edit Project' : 'Create New Project'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Project Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formData.description}
                  onChange={handleChange('description')}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={handleChange('startDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={handleChange('endDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  minDate={formData.startDate}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  name="status"
                  label="Status"
                  value={formData.status}
                  onChange={handleChange('status')}
                  fullWidth
                >
                  <MenuItem value="Planning">Planning</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {id ? 'Update Project' : 'Create Project'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default ProjectForm;
