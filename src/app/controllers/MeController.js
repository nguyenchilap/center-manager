const Student = require('../models/Student');
const {mongooseToObject} = require('../../utils/mongoose');

class MeController{

    // [GET] /me/account
    edit(req, res, next){
        Student.findOne({account: req.user})
        .then(student => {
            res.render('me/account', {
                user: req.user,
                userInfo: mongooseToObject(student),
            });
        })
        .catch(next);
    }

    // [PUT] /me/account
    update(req, res, next){
        Student.findOne({account: req.user})
        .then(student => {
            this.updateOne({ _id: student._id }, req.body )
            .then(() => res.redirect('back'))
            .catch(next);
        })
        
    }
}

module.exports = new MeController();