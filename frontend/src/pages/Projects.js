import React from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';

const Projects = () => {
  // This is a placeholder. In a real app, you would fetch this data from your API
  const projects = [
    {
      id: 1,
      name: 'Employee Portal',
      description: 'Internal employee management system',
      status: 'In Progress',
      progress: 65,
      team: ['John Doe', 'Jane Smith'],
      deadline: '2024-06-30',
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'on hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, mt: 3 }}>
        <Typography variant="h4">
          Projects
        </Typography>
        <Button
          variant="contained"
          color="primary"
        >
          New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {project.name}
                </Typography>
                <Chip
                  label={project.status}
                  color={getStatusColor(project.status)}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="textSecondary" paragraph>
                  {project.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Team Members:
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {project.team.map((member, index) => (
                    <Chip
                      key={index}
                      label={member}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small">View Details</Button>
                <Button size="small" color="primary">Edit</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects; 