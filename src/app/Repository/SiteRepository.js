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
}

module.exports = new SiteRepository;