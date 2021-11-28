const accountRouter = require('./accounts');
const siteRouter = require('./site');
const meRouter = require('./me');
const courseRouter = require('./courses');
const passport = require('../config/passport');

function route(app){
    app.use('/courses', courseRouter);
    app.use('/account', accountRouter);
    app.use('/me', meRouter);

    app.post('/logout', function(req, res){
        req.logout();
        res.redirect('back');
    });
    app.use('/', siteRouter);
    
}



module.exports = route;
