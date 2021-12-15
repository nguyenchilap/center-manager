const accountRepo = require('../Repository/AccountRepository');


class AccountController{

    // [POST] /account/signup
    signup(req, res, next){
        const student = accountRepo.modifyStudent(req.body);
        student.save()
        .then(() => res.redirect('/?notiMessage=Đăng kí thành công!!!'))
        .catch(next);
    }
}

module.exports = new AccountController();