const Course = require('../models/Course');
const Student = require('../models/Student');

const {mongooseToObject} = require('../../utils/mongoose');

class CourseController{
    //[GET] /courses/show/:id
    show(req, res, next){
        Promise.all([Course.findOne({_id: req.params.id}), Student.findOne({account: req.user})])
        .then(([course,student]) => res.render('courses/show',{
                user: req.user,
                userInfo: mongooseToObject(student),
                course: mongooseToObject(course)
        }))
        .catch(next);
    }

    //[POST] /courses/show/:id/push-comment
    pushComment(req, res, next){
        Course.updateOne({_id: req.params.id}, {
            $push: {
                courseComments: {
                    accountId: req.body.accountId,
                    studentName: req.body.studentName,
                    studentAvatar: req.body.studentAvatar,
                    comment: req.body.comment,
                    commentAt: Date.now()
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