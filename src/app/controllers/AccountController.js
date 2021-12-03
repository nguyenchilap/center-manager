const bcrypt = require('bcryptjs');

const Student = require('../models/Student');

class AccountController{

    // [POST] /account/signup
    signup(req, res, next){
        const formData = req.body;
        const hashedPassword = bcrypt.hashSync(formData.password, 10);

        const student = new Student({    
            name: formData.name,
            birth: `${formData['DOB-day']}/${formData['DOB-month']}/${formData['DOB-year']}`,
            phone: formData.phone,
            email: formData.email,
            account: {
                username: formData.username,
                password: hashedPassword,
            },
        });

        student.save()
        .then(() => res.redirect('/?notiMessage=Đăng kí thành công!!!'))
        .catch(next);
    }
}

module.exports = new AccountController();