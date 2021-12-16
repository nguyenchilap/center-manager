const Student = require('../models/Student');
const Course = require('../models/Course');
const CourseType = require('../models/CourseType');

const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');
const {uploadStudentImage} = require('../../config/firebase');

const meRepo = require('../Repository/MeRepository');
const bcrypt = require('bcryptjs');

class MeController{

    // [GET] /me/account
    showMyInfo(req, res, next){
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
        const newInfo = meRepo.createNewInfo(req.body);

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
            res.render('me/courses',{ 
                courses: meRepo.modifyCourses(multiMongooseToObject(courses), req.user),
                coursetypes: multiMongooseToObject(coursetypes),
                user: mongooseToObject(student),
                maxItemPerPage: 6,
            });
        })
        .catch(next);
    }

    // [GET] /me/change-password
    showChangePassword(req, res, next){
        Student.findOne({_id: req.user._id})
        .then((student) => res.render('me/change-password', {
            user: mongooseToObject(student)
        }))
        .catch(next);
    }

    // [POST] /me/change-password
    changePassword(req, res, next){
        Student.findOne({_id: req.user._id})
        .then(student => {
            if (!bcrypt.compareSync(req.body.password, student.account.password)) 
                res.json({notiMessage: 'Unmatched current password !!!! Try again !!!'});
            else{
                const hashedPassword = bcrypt.hashSync(req.body.confirmPassword, 10);
                Student.updateOne({_id: req.user._id}, {'account.password': hashedPassword})
                .then(() => res.json({
                    notiMessage: 'Password changed successfully !!! You are about to logged out!!!',
                    success: 1
                }))
                .catch(next);
            }
        })  
        .catch(next);
    }
}

module.exports = new MeController();