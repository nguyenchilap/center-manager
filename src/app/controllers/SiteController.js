const Student = require('../models/Student');
const Course = require('../models/Course');
const CourseType = require('../models/CourseType');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

const siteRepo = require('../Repository/SiteRepository');
const passport = require('../../config/passport');
const bcrypt = require('bcryptjs');
const {getTransporterForOtp} = require('../../utils/nodemailer');

class SiteController{

    // [GET] /
    index(req, res, next){
        const user = req.user ? req.user : {};
        Promise.all([Course.find(), CourseType.find(), Student.findOne({_id: user._id})])
        .then(([courses, coursetypes, student]) => {
            let courseObjects = multiMongooseToObject(courses);
            courseObjects = siteRepo.calcRatedCourse(courseObjects);            
            //check registered    
            if (req.user){
                courseObjects = siteRepo.checkRegisteredCourse(courseObjects, req.user);
            }
            res.render('home', {
                user: mongooseToObject(student),
                courses: courseObjects,
                coursetypes: multiMongooseToObject(coursetypes),
                maxItemPerPage: 6,
            });
        })
        .catch(next);
    }

    // [POST] /
    login(req, res, next){
        passport.authenticate('localLogin', function(err, user, info){
            if (err) return next(err);
            if (!user) res.json({notiMessage: info.message});
            req.login(user, function(err){
                if (err) return next(err);
                res.json({
                    user,
                    redirect: '/',
                })
            })
        })(req, res, next);
    }

    // [POST] /check-username
    checkUsername(req, res, next){
        Student.findOne({'account.username': req.body.username})
        .then((student) => {
            if (student) res.json({exists: true});
            else res.json({exists: false});
        })
        .catch(next);
    }

    // [POST] /send-otp
    async sendOtp(req, res, next){
        const otp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        const transporter = getTransporterForOtp('nguyenchilapk18@gmail.com', 'Lapboy20');
        const mailOption = await siteRepo.getMailforOtp(req.body.username, otp);
        transporter.sendMail(mailOption, function(err, info){
            if (err) next(err);
            else res.json({otp: otp});
        })
    }

    // [POST] /change-password
    changePassword(req, res, next){
        const username = req.body.username;
        const password = bcrypt.hashSync(req.body.password, 10);
        Student.updateOne({'account.username': username}, {'account.password': password})
        .then(() => {
            res.json({
                notiMessage :'Password had changed successfully !!!',
            })
        })
        .catch(next);
    }

    // [POST] /sort-course
    sortCourse(req, res, next){
        Course.find({})
        .sort({
            [req.body.field] : req.body.type,
        })
        .then((courses) => res.json(multiMongooseToObject(courses)))
        .catch(next);
    }
}

module.exports = new SiteController();