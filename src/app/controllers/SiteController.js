const Student = require('../models/Student');
const {mongooseToObject} = require('../../utils/mongoose');

class SiteController{

    // [GET] /
    index(req, res, next){
        res.render('home');
    }

    // [POST] /
    login(req, res, next){
        Student.findOne({account: req.user})
        .then(student => {
            res.render('home', {
                user: req.user,
                userInfo: mongooseToObject(student),
            });
        })
        
    }
}

module.exports = new SiteController();