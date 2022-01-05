const Course = require('../models/Course');
const Student = require('../models/Student');
const ObjectId = require('mongoose').Types.ObjectId; 

const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');
const courseRepo = require('../Repository/CourseRepository');

class CourseController{
    //[GET] /courses/show/:id
    show(req, res, next){
        const user = req.user ? req.user : {};
        Promise.all([Course.findOne({_id: req.params.id}), Student.findOne({_id: user._id})])
        .then(async ([course, student]) => {
            const courseResult = await courseRepo.renderCourse(mongooseToObject(course), next);
            let currentStudent;
            if (user._id)
                currentStudent = courseResult.courseStudents.find(student => student.studentId.toString() === user._id.toString());
            res.render('courses/show',{
                course: courseResult,
                currentStudent,
                maxRenderStudents: 4,
                user: mongooseToObject(student),
                relatedCourses : await courseRepo.findRelatedCourses(mongooseToObject(course))
            })
        })
        .catch(next);
    }

    //[POST] /courses/show/:id/push-comment
    pushComment(req, res, next){
        Course.updateOne({_id: req.params.id}, {
            $push: {
                courseComments: {
                    studentId: req.body.studentId,
                    studentName: req.body.studentName,
                    comment: req.body.comment,
                }
            }
        })
        .then(() => {
            Course.findOne({_id: req.params.id})
            .then((course) => {
                res.json({
                    name: req.body.studentName,
                    comment: req.body.comment,
                    commentId: courseRepo.findLastCommentId(course, req.body.studentId)
                });
            });
        })
    }

    //[POST] /courses/show/:id/delete-comment
    deleteComment(req, res, next){
        Course.updateOne({_id: req.params.id}, {
            $pull: {
                courseComments: {
                    _id: req.body.commentId
                }
            }
        })
        .then(() => res.json({success: 1}))
        .catch(next);
    }

    //[POST] /courses/show/:id/edit-comment
    editComment(req, res, next){
        Course.updateOne({_id: req.params.id, 'courseComments._id': req.body.commentId}, 
        {
            $set: {
                'courseComments.$.comment': req.body.comment,
                'courseComments.$.commentAt': Date.now(),
            }
        }, function(err){
            res.json({
                comment: req.body.comment,
                success: 1,
                err
            })
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

    //[POST] /courses/de-register/:courseId/:studentId
    deRegister(req, res, next){
        Course.findOne({_id: req.params.courseId})
        .then((course) => {
            course = courseRepo.removeStudentInCourse(course, req.params.studentId.toString());
            Course.updateOne({_id: req.params.courseId}, {courseStudents: course.courseStudents})
            .then(() => res.redirect('/me/courses'))
            .catch(next);
        })
        .catch(next);
    }

    //[POST] /courses/rate/:courseId/:studentId
    rate(req, res, next){
        Course.findOne({_id: req.params.courseId})
        .then((course) => {
            courseRepo.rateCourse(course, req.params.studentId, req.body.rate);
            Course.updateOne({_id: req.params.courseId}, {courseStudents: course.courseStudents, rated: course.rated})
            .then(() => res.redirect('back'))
            .catch(next);
        })
        .catch(next);
    }

}

module.exports = new CourseController();