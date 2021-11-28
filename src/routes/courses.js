const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController');

//define route

router.post('/register/:courseId/:studentId', courseController.register);

router.post('/show/:id/push-comment', courseController.pushComment);
router.get('/show/:id', courseController.show);

module.exports = router;