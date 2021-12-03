const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Student = require('../../app/models/Student');
const bcrypt = require('bcryptjs');

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(function(username, password, done) {
    Student.findOne({"account.username": username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Username not found' });
        }
        if (!bcrypt.compareSync(password, user.account.password)) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    });
}))



module.exports = passport;