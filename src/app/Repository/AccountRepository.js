const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

class AccountRepository{
    modifyStudent(formData){
        const hashedPassword = bcrypt.hashSync(formData.password, 10);

        return new Student({    
            name: formData.name,
            birth: `${formData['DOB-day']}/${formData['DOB-month']}/${formData['DOB-year']}`,
            phone: formData.phone,
            email: formData.email,
            account: {
                username: formData.username,
                password: hashedPassword,
            },
        });
    }
}

module.exports = new AccountRepository();