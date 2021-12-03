const Student = require('../models/Student');
const Course = require('../models/Course');
const CourseType = require('../models/CourseType');

const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');
const {uploadStudentImage} = require('../../config/firebase');
const ObjectId = require('mongoose').Types.ObjectId; 



class MeController{

    // [GET] /me/account
    edit(req, res, next){
        Student.findOne({_id: req.user._id})
        .then(student => {
            const studentObject = mongooseToObject(student);
            res.render('me/account', {
                user: mongooseToObject(student),
                userBirth: {
                    day: studentObject.birth.split('/')[0],
                    month: studentObject.birth.split('/')[1],
                    year: studentObject.birth.split('/')[2],
                }
            });
        })
        .catch(next);
    }

    // [PUT] /me/account/edit
    update(req, res, next){
        const formData = req.body;
        const newInfo = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            birth: `${formData["DOB-day"]}/${formData["DOB-month"]}/${formData["DOB-year"]}`,
        };

        Student.updateOne({_id: req.user._id}, newInfo)
        .then(() => res.redirect('back'))
        .catch(next);
    }

    // [POST] /me/account/edit-avatar
    uploadImg(req, res, next){
        const fileData = req.file;
        async function getUrlImg(){
            return await uploadStudentImage(`src/public/img/users/${req.user._id}/${fileData.originalname}`, fileData.originalname, req.user._id);
        }
        getUrlImg()
        .then(url => {
            Student.updateOne({ _id: req.user._id }, {img: url})
            .then(() => res.redirect('back'))
            .catch(next);
        })
        .catch(next);
    }

    // [GET] /me/courses
    showMyCourses(req, res, next){
        Promise.all([Course.find({"courseStudents.studentId": Object(req.user._id)}), Student.findOne({_id: req.user._id}), CourseType.find()])
        .then(([courses, student, coursetypes]) => {
            let courseObjects = multiMongooseToObject(courses);
            courseObjects.myRegistry = courseObjects.map((courseObject) => {
                return courseObject.courseStudents.find(student => student.studentId === req.user._id);
            })
            res.render('me/courses',{ 
                courses: courseObjects,
                coursetypes: multiMongooseToObject(coursetypes),
                user: mongooseToObject(student),
                maxItemPerPage: 6,
            });
        })
        .catch(next);
    }
}

module.exports = new MeController();