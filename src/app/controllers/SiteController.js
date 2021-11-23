const Student = require('../models/Student');
const Course = require('../models/Course');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

const {getUser} = require('../../utils/getUser');
const ObjectId = require('mongoose').Types.ObjectId; 

class SiteController{

    // [GET] /
    index(req, res, next){
        Promise.all([Course.find({}), Student.findOne({account: req.user})])
        .then(([courses, student]) => {
            res.render('home', {
                user: req.user,
                userInfo: mongooseToObject(student),
                courses: multiMongooseToObject(courses)
            });
        })
        .catch(next);
    }

    // [POST] /
    login(req, res, next){
        const user = req.user;
        Student.findOne({account: ObjectId(user._id)})
        .then(student => {
            res.redirect('/');
        })
        .catch(next);
    }
}

module.exports = new SiteController();