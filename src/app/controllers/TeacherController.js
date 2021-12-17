class TeacherController{
    //[GET] /teachers
    renderTeachers(req, res, next){
        res.render('teachers/teachers');
    }
}

module.exports = new TeacherController();