const accountRouter = require('./accounts');
const siteRouter = require('./site');
const meRouter = require('./me');
const courseRouter = require('./courses');
const teacherRouter = require('./teachers');

function route(app){
    app.use('/teachers', teacherRouter);
    app.use('/courses', courseRouter);
    app.use('/account', accountRouter);
    app.use('/me', meRouter);

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
    app.use('/', siteRouter);
    
}



module.exports = route;
