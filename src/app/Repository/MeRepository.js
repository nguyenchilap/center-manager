class MeRepository{
    createNewInfo(formData){
        return {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            birth: `${formData["DOB-day"]}/${formData["DOB-month"]}/${formData["DOB-year"]}`,
        }
    }

    modifyCourses(courses, user){
        courses.myRegistry = courses.map((course) => {
            return course.courseStudents.find(student => student.studentId === user._id);
        })
        return courses;
    }
}

module.exports = new MeRepository;