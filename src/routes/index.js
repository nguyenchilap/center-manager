const accountRouter = require('./accounts');
const siteRouter = require('./site');
const meRouter = require('./me');
const passport = require('../config/passport');

function route(app){
    app.use('/account', accountRouter);
    app.use('/me', meRouter);

    app.use('/', siteRouter);
    app.post('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });
}



module.exports = route;
