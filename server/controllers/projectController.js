const Project = require('../models/Project.js')

// Create a new project
const createProject = async (req, res) => {
  console.log({ user: req.user })
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.user._id,
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('employees', 'firstName lastName position');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('employees', 'firstName lastName position');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Key Stats
const getKeyStats = async (req, res) => {
  try {
    const allProjects = await Project.find();

    const totalProjects = allProjects.length;

    const activeProjects = allProjects.filter(p => p.status === 'In Progress').length;

    const now = new Date();
    const currentQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);

    const recentQuarterProjects = allProjects.filter(project => {
      const createdAt = new Date(project.createdAt);
      return createdAt >= currentQuarterStart;
    });

    res.json({
      totalProjects,
      activeProjects,
      recentQuarterProjects: {
        count: recentQuarterProjects.length,
        projects: recentQuarterProjects.map(p => ({
          _id: p._id,
          name: p.name,
          status: p.status,
          createdAt: p.createdAt
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getKeyStats,
};