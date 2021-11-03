const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const meController = require('../app/controllers/MeController');

//define route
router.get('/account', meController.edit);
router.put('/account', meController.update);


module.exports = router;