const Student = require('../app/models/Student');
const {mongooseToObject} = require('./mongoose');


module.exports = {
    getUser: function(view, req, res, next){
        Student.findOne({account: req.user})
        .then(student => {
            res.render(view, {
                user: req.user,
                userInfo: mongooseToObject(student),
            });
        })
        .catch(next);
    }
}
