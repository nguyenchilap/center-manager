const express = require('express');
const router = express.Router();

const teacherController = require('../app/controllers/TeacherController');

//define route
router.get('/', teacherController.renderTeachers);

module.exports = router;