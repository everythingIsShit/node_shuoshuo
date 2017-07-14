
/**
 * Module dependencies.
 */

var express = require('express');
var router = require('./routes/router.js');
var session = require('express-session')

var app = express();
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
// all environments

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use('/avatar',express.static('./avatar'));


app.get('/', router.showIndex);

app.get('/register',router.showRegister);

app.post('/doRegister',router.doRegister);

app.get('/login',router.showLogin);

app.post('/doLogin',router.doLogin);

app.get('/setAvatar',router.setAvatar);

app.post('/cutAvatar',router.cutAvatar);

app.get('/cut',router.cut);

app.get('/docut',router.docut);

app.listen(3000);