const Student = require('../models/Student');
const {mongooseToObject} = require('../../utils/mongoose');

const {getUser} = require('../../utils/getUser');

class SiteController{

    // [GET] /
    index(req, res, next){
        getUser('home', req, res, next);
    }

    // [POST] /
    login(req, res, next){
        getUser('home', req, res, next);
    }
}

module.exports = new SiteController();