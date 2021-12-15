const nodemailer = require('nodemailer');

module.exports = {
    getTransporterForOtp: (email, password) => {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: email, // generated ethereal user
                pass: password, // generated ethereal password
            },
        });
        return transporter;
    }
};