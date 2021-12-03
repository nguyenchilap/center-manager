const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

const siteController = require('../app/controllers/SiteController');

//define route
router.get('/', siteController.index);

router.post('/', passport.authenticate('local', { failureFlash: true, 
                                                failureRedirect: '/?notiMessage=Tên đăng nhập hoặc mật khẩu không đúng' 
                                            }), siteController.login);

module.exports = router;