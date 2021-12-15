const accountRepo = require('../Repository/AccountRepository');


class AccountController{

    // [POST] /account/signup
    signup(req, res, next){
        const student = accountRepo.modifyStudent(req.body);
        student.save()
        .then(() => res.json({
            notiMessage: "Sign up successfully !!!"
        }))
        .catch(next);
    }
}

module.exports = new AccountController();