const express = require('express');
const router = express.Router();

const accountController = require('../app/controllers/AccountController');

//define route

router.post('/signup', accountController.signup);

module.exports = router;