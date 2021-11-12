const fs = require('fs-extra');

const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const {uploadAvatar} = require('../utils/uploadImage'); 

const meController = require('../app/controllers/MeController');

//define route
router.get('/account', meController.edit);
router.put('/account/edit', meController.update);
router.post('/account/edit-avatar', uploadAvatar.single('img'), meController.uploadImg);


module.exports = router;