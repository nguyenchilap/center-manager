const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const siteController = require('../app/controllers/SiteController');

//define route
router.get('/', siteController.index);

router.post('/', passport.authenticate('local', { failureFlash: true }), siteController.login);

module.exports = router;