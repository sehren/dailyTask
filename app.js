var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var app = express();
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');
knex = require('knex')({
	client : 'mysql',
	connection : {
		host : 'sql12.freemysqlhosting.net',
		user : 'sql12287267',
		password : 'muy4sxeMg4',
		database : 'sql12287267',
		port : '3306'
	}
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret: 'ssshhhhh'}));
app.use(flash());
var manager = require('./routes/manager')(app,mysql,knex);
var employee = require('./routes/employee')(app,mysql,knex);
var login = require('./routes/login')(app,mysql,knex);
app.get('/*',function(req,res){
	res.render('error')
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
