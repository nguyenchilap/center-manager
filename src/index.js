const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');

const route = require('./routes');
const db = require('./config/db');

// Authentication Packages
const session = require('express-session');
const passport = require('./config/passport');
const flash = require('connect-flash');

//connect to DB
db.connect();

const app = express();
const port = 3000;

app.use(
  express.urlencoded({
      extended: true,
  }),
);
// app.use(express.json);
app.use(flash());

// override with the X-HTTP-Method-Override header in the request
app.use(methodOverride('_method'));

//Express Session
app.use(session({
  secret: 'ansckansclahicqwunak',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

//Use Passport
app.use(passport.initialize());
app.use(passport.session());

//Add static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join('D:/Hoc web/f8_learn/NodeJs/center-management-admin/src', 'public')));

//HTTP logger
app.use(morgan('combined'));

//Template Engine
app.engine('hbs', 
  handlebars({
    extname: '.hbs',
    helpers: {
        sum: (a, b) => a + b,
        isNone: param => param === 'none', 
        modifyDate: param => `${param.getDate()}/${param.getMonth() + 1}/${param.getYear()-100+2000}`
    },
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/resources/views'));

//Route init
route(app);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})