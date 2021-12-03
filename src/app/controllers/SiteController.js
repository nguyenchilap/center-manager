const Student = require('../models/Student');
const Course = require('../models/Course');
const CourseType = require('../models/CourseType');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

const ObjectId = require('mongoose').Types.ObjectId; 

class SiteController{

    // [GET] /
    index(req, res, next){
        const user = req.user ? req.user : {};
        Promise.all([Course.find(), CourseType.find(), Student.findOne({_id: user._id})])
        .then(([courses, coursetypes, student]) => {
            let coursesObjects = multiMongooseToObject(courses);

            coursesObjects.forEach(courseObject => {
                //check registered
                if (req.user){
                    courseObject.courseStudents.every(courseStudent => {
                        if (courseStudent.studentId.toString() === req.user._id){
                            courseObject.registered = true;
                            return false;
                        }
                        return true;
                    });
                }
                //calc rated
                let accumulator = 0;
                let rateCount = 0;
                courseObject.courseStudents.forEach(courseStudent => {
                    if (courseStudent.rate) {
                        accumulator = (accumulator*rateCount + courseStudent.rate)/(rateCount + 1);
                        rateCount += 1;
                    }
                })
                courseObject.rated = Math.round(accumulator*10)/10;
            })
            res.render('home', {
                notiMessage: req.query.notiMessage,
                user: mongooseToObject(student),
                courses: coursesObjects,
                coursetypes: multiMongooseToObject(coursetypes),
                maxItemPerPage: 6,
            });
        })
        .catch(next);
    }

    // [POST] /
    login(req, res, next){
        res.redirect('back');
    }
}

module.exports = new SiteController();