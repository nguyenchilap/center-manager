Student = require('../models/Student');
const ObjectId = require('mongoose').Types.ObjectId; 
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

class CourseRepository {
    renderCourse(course){
        const commentAccountIds = course.courseComments.map(function(item, index){
            return ObjectId(item.studentId);
        });
        const registerAccountIds = course.courseStudents.map(function(item, index){
            return ObjectId(item.studentId);
        });

        return Promise.all([Student.find({_id: {$in: commentAccountIds}}), Student.find({_id: {$in: registerAccountIds}})])
        .then(([commentedStudents, registeredStudents]) => {
            console.log(course);
            const commentedStudentObjects = multiMongooseToObject(commentedStudents);
            const registeredStudentObjects = multiMongooseToObject(registeredStudents);
            
            if (commentedStudentObjects.length){
                //render image of comments
                const commentImages = commentAccountIds.map((accountId) => {
                    return commentedStudentObjects.find(studentObject => studentObject._id.toString() === accountId.toString()).img;
                });
                //render name of comments
                const commentNames = commentAccountIds.map((accountId) => {
                    return commentedStudentObjects.find(studentObject => studentObject._id.toString() === accountId.toString()).name;
                });
                course.courseComments.forEach((courseComment,index) => {
                    courseComment.img = commentImages[index];
                    courseComment.studentName = commentNames[index];
                });
            }

            if (registeredStudentObjects.length){
                //render image of registered students
                const registerImages = registerAccountIds.map((accountId) => {
                    return registeredStudentObjects.find(studentObject => studentObject._id.toString() === accountId.toString()).img;
                });
                course.courseStudents.forEach((courseStudent,index) => {courseStudent.img = registerImages[index]});
            }
            return course;
        })
    }

    removeStudentInCourse(course, studentId){
        const student = course.courseStudents.find(courseStudent => courseStudent.studentId.toString() === studentId);
        const indexOfStudent = course.courseStudents.indexOf(student);
        if (indexOfStudent > -1) {
            course.courseStudents.splice(indexOfStudent, 1);
        }
        return course;
    }
}

module.exports = new CourseRepository;