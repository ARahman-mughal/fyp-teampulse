const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController.js')
const { protect } = require('../middleware/auth')

router.route('/stats')
  .get(protect, projectController.getKeyStats)

router.route('/')
  .post(protect, projectController.createProject)
  .get(protect, projectController.getProjects);

router.route('/:id')
  .get(protect, projectController.getProjectById)
  .put(protect, projectController.updateProject)
  .delete(protect, projectController.deleteProject);

  module.exports = router;