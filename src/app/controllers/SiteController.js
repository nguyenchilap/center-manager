const Student = require('../models/Student');
const Course = require('../models/Course');
const CourseType = require('../models/CourseType');
const {mongooseToObject, multiMongooseToObject} = require('../../utils/mongoose');

const siteRepo = require('../Repository/SiteRepository');
const passport = require('../../config/passport');

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
}

module.exports = new SiteController();