const Student = require('../models/Student');

class SiteRepository {
    checkRegisteredCourse(courses, user){
        courses.forEach(function(course){
            course.courseStudents.every(courseStudent => {
                if (courseStudent.studentId.toString() === user._id){
                    course.registered = true;
                    return false;
                }
                return true;
            });
        });
        return courses;
    }

    calcRatedCourse(courses){
        courses.forEach(course => {
            //calc rated
            let accumulator = 0;
            let rateCount = 0;
            course.courseStudents.forEach(courseStudent => {
                if (courseStudent.rate) {
                    accumulator = (accumulator*rateCount + courseStudent.rate)/(rateCount + 1);
                    rateCount += 1;
                }
            });
            course.rated = Math.round(accumulator*10)/10;
        });
        return courses;
    }

    getMailforOtp(username, otp){
        return Student.findOne({'account.username': username})
        .then((student) => {
            return {
                from: '"🍺 Edu Center 🍺 👻" <nguyenchilapk18@gnmail.com>', // sender address
                to: student.email, // list of receivers
                subject: "Verify password with OTP ✔", // Subject line
                text: "Use this OTP to create new password", // plain text body
                html: "<h3>Your OTP:</h3>" + 
                `<div style="display: flex;">
                    <div> ༼ つ ◕_◕ ༽つ </div>
                    <h1 style="font-weight: bold; color: red; margin-left: 100px;">${otp}</h1>
                </div>`, // html body
            }
        });
    }
}

module.exports = new SiteRepository;