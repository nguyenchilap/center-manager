const multer  = require('multer');
const fs = require('fs-extra');

const Student = require('../models/Student');
const {mongooseToObject} = require('../../utils/mongoose');
const ObjectId = require('mongoose').Types.ObjectId; 

class MeController{

    // [GET] /me/account
    edit(req, res, next){
        Student.findOne({account: req.user})
        .then(student => {
            const studentObject = mongooseToObject(student);
            res.render('me/account', {
                user: req.user,
                userInfo: studentObject,
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
        const user = req.user;

        const newInfo = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            birth: `${formData["DOB-day"]}/${formData["DOB-month"]}/${formData["DOB-year"]}`,
        };

        Student.findOne({account: ObjectId(user._id)})
        .then(student => {
            Student.updateOne({ _id: student._id }, newInfo)
            .then(() => res.redirect('back'))
            .catch(next);
        })
        .catch(next);
    }

    // [POST] /me/account/edit-avatar
    uploadImg(req, res, next){
        const formData = req.body;
        const user = req.user;

        Student.findOne({account: ObjectId(user._id)})
        .then(student => {
            Student.updateOne({ _id: student._id }, {img: formData.img})
            .then(() => res.redirect('back'))
            .catch(next);
        })
        .catch(next);
    }
}

module.exports = new MeController();