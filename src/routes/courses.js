const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController');

//define route

router.get('/show/:id', courseController.show);

module.exports = router;