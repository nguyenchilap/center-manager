const Course = require('../models/Course');
const Student = require('../models/Student');
const ObjectId = require('mongoose').Types.ObjectId; 

const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

class CourseController{
    //[GET] /courses/show/:id
    show(req, res, next){
        Promise.all([Course.findOne({_id: req.params.id}), Student.findOne({account: req.user})])
        .then(([course, student]) => {
            let courseObject = mongooseToObject(course);
            const accountIds = courseObject.courseComments.map(function(item, index){
                    return ObjectId(item.accountId);
            })
            Student.find({account: {$in: accountIds}})
            .then(students => {
                const studentObjects = multiMongooseToObject(students);
                const studentImages = accountIds.map((accountId) => {
                    return studentObjects.find(studentObject => studentObject.account.toString() === accountId.toString()).img;
                })
                courseObject.courseComments.forEach((courseComment,index) => {courseComment.img = studentImages[index]});
                res.render('courses/show',{
                    course: courseObject,
                    user: req.user,
                    userInfo: mongooseToObject(student),
                })
            })
            .catch(next);
        })
        .catch(next);
    }

    //[POST] /courses/show/:id/push-comment
    pushComment(req, res, next){
        Course.updateOne({_id: req.params.id}, {
            $push: {
                courseComments: {
                    accountId: req.body.accountId,
                    studentName: req.body.studentName,
                    comment: req.body.comment,
                }
            }
        }, function(error){
            res.json({
                name: req.body.studentName,
                comment : req.body.comment,
            });
        })
    }

    //[POST] /courses/register/:courseId/:studentId
    register(req, res, next){
        Course.updateOne({_id: req.params.courseId}, {
            $push: {courseStudents: {studentId: req.params.studentId}}
        })
        .then((error) => res.redirect('/me/courses'))
        .catch(next);
    }
}

module.exports = new CourseController();