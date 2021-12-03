const bcrypt = require('bcryptjs');

const Account = require('../models/Account');
const Student = require('../models/Student');

class AccountController{

    // [POST] /account/signup
    signup(req, res, next){
        const formData = req.body;
        const hashedPassword = bcrypt.hashSync(formData.password, 10);

        const account = new Account({
            username: formData.username,
            password: hashedPassword,
        })

        account
        .save(function(){
            const student = new Student({    
                name: formData.name,
                birth: `${formData['DOB-day']}/${formData['DOB-month']}/${formData['DOB-year']}`,
                phone: formData.phone,
                email: formData.email,
                account: account._id,
            });

            student.save()
            .then(() => res.redirect('/?notiMessage=Đăng kí thành công!!!'))
            .catch(next);
        })
    }
}

module.exports = new AccountController();