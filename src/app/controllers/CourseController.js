const Course = require('../models/Course');
const Student = require('../models/Student');

const {mongooseToObject} = require('../../utils/mongoose');

class CourseController{
    show(req, res, next){
        Promise.all([Course.findOne({_id: req.params.id}), Student.findOne({account: req.user})])
        .then(([course,student]) => res.render('courses/show',{
                user: req.user,
                userInfo: mongooseToObject(student),
                course: mongooseToObject(course)
        }))
        .catch(next);
    }
}

module.exports = new CourseController();