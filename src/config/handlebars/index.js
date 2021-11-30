const handlebars = require('express-handlebars');


module.exports = {
    sum: (a, b) => a + b,
    div: (a, b) => a >= b ? (a - a%b)/b : 1,
    isNone: param => param === 'none', 
    modifyDate: param => `${param.getDate()}/${param.getMonth() + 1}/${param.getYear()-100+2000}`,
    modifyDateTime: param => param.toLocaleString(),
    getItemByIndex: (arr, index) => arr[index],
    checkStudentInCourse: (studentId, courseStudents) => {
        if (!studentId)
            return false;
        for(let i = 0; i < courseStudents.length; i++){
            if (courseStudents[i].studentId.toString() === studentId.toString()) return true;
        }
        return false;
    },
}
