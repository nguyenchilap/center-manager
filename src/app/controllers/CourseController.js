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
            const commentAccountIds = courseObject.courseComments.map(function(item, index){
                    return ObjectId(item.accountId);
            });
            const registerAccountIds = courseObject.courseStudents.map(function(item, index){
                return ObjectId(item.studentId);
            });

            let currentStudent;
            if (req.user)
                currentStudent = courseObject.courseStudents.find(student => student.studentId.toString() === req.user._id.toString());

            Promise.all([Student.find({account: {$in: commentAccountIds}}), Student.find({account: {$in: registerAccountIds}})])
            .then(([commentedStudents, registeredStudents]) => {
                const commentedStudentObjects = multiMongooseToObject(commentedStudents);
                const registeredStudentObjects = multiMongooseToObject(registeredStudents);
                
                //render image of comments
                const commentImages = commentAccountIds.map((accountId) => {
                    return commentedStudentObjects.find(studentObject => studentObject.account.toString() === accountId.toString()).img;
                });
                //render image of registered students
                const registerImages = registerAccountIds.map((accountId) => {
                    return registeredStudentObjects.find(studentObject => studentObject.account.toString() === accountId.toString()).img;
                });
                
                courseObject.courseComments.forEach((courseComment,index) => {courseComment.img = commentImages[index]});
                courseObject.courseStudents.forEach((courseStudent,index) => {courseStudent.img = registerImages[index]});

                res.render('courses/show',{
                    course: courseObject,
                    currentStudent,
                    maxRenderStudents: 4,
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

    //[POST] /courses/de-register/:courseId/:studentId
    deRegister(req, res, next){
        Course.findOne({_id: req.params.courseId})
        .then((course) => {
            const student = course.courseStudents.find(courseStudent => courseStudent.studentId.toString() === req.params.studentId.toString());
            const indexOfStudent = course.courseStudents.indexOf(student);
            if (indexOfStudent > -1) {
                course.courseStudents.splice(indexOfStudent, 1);
            }
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
            const student = course.courseStudents.find(courseStudent => courseStudent.studentId.toString() === req.params.studentId.toString());
            const indexOfStudent = course.courseStudents.indexOf(student);
            
            course.courseStudents[indexOfStudent].rate = Number(req.body.rate);
            Course.updateOne({_id: req.params.courseId}, {courseStudents: course.courseStudents})
            .then(() => res.redirect('back'))
            .catch(next);
        })
        .catch(next);
    }
}

module.exports = new CourseController();