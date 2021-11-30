const Student = require('../models/Student');
const Course = require('../models/Course');
const CourseType = require('../models/CourseType');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

const {getUser} = require('../../utils/getUser');
const ObjectId = require('mongoose').Types.ObjectId; 

class SiteController{

    // [GET] /
    index(req, res, next){
        Promise.all([Course.find(), CourseType.find(), Student.findOne({account: req.user})])
        .then(([courses, coursetypes, student]) => {
            let coursesObjects = multiMongooseToObject(courses);
            if (req.user){
                coursesObjects.forEach(courseObject => {
                    courseObject.courseStudents.every(courseStudent => {
                        if (courseStudent.studentId.toString() === req.user._id){
                            courseObject.registered = true;
                            return false;
                        }
                        return true;
                    })
                })
            }
            res.render('home', {
                user: req.user,
                userInfo: mongooseToObject(student),
                courses: coursesObjects,
                coursetypes: multiMongooseToObject(coursetypes),
                maxItemPerPage: 6,
            });
        })
        .catch(next);
    }

    // [POST] /
    login(req, res, next){
        const user = req.user;
        Student.findOne({account: ObjectId(user._id)})
        .then(student => {
            res.redirect('back');
        })
        .catch(next);
    }
}

module.exports = new SiteController();