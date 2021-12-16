const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

//define route
router.post('/send-otp', siteController.sendOtp);
router.post('/change-password', siteController.changePassword);
router.post('/check-username', siteController.checkUsername);

router.post('/sort-course', siteController.sortCourse);
router.get('/', siteController.index);
router.post('/', siteController.login);

module.exports = router;