var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
let multer = require('multer');//类
let fs = require('fs');

// var user_index = require('');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var lunboRouter = require('./routes/lunbo');
var commentRouter = require('./routes/comment');
var apiUsersRouter = require('./api/users');
var apiProductRouter = require('./api/product');
var apiLunboRouter = require('./api/lunbo');
var app = express();

//解决跨域问题
app.all('/api/*', function(req, res, next) {  
  res.header("Access-Control-Allow-Origin", "*");  
  res.header("Access-Control-Allow-Headers", "X-Requested-With");  
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
  res.header("X-Powered-By",' 3.2.1')  
  res.header("Content-Type", "application/json;charset=utf-8");  
  next();  
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public/template/dist')));

app.use(express.static(path.join(__dirname, 'public')));
//托管当前目录，对应代码在设置lunbo.js 设置图片路径
app.use(express.static(path.join(__dirname, '.')));
app.use(bodyParser())

//前端托管目录
app.use(express.static(path.join(__dirname, 'public','template')));
app.use(express.static(path.join(__dirname, 'public')));


app.all('/users/*', (req, res, next) => {
  if (req.cookies.isLogin == 1) {
    next()
  } else {
    res.redirect('/login')
  }
})
app.all('/product/*/*', (req, res, next) => {
  if (req.cookies.isLogin == 1) {
    next()
  } else {
    res.redirect('/login')
  }
})

app.all('/lunbo/*/*', (req, res, next) => {
  if (req.cookies.isLogin == 1) {
    next()
  } else {
    res.redirect('/login')
  }
})

app.all('/comment/*/*', (req, res, next) => {
  if (req.cookies.isLogin == 1) {
    next()
  } else {
    res.redirect('/login')
  }
})

// app.use('/user_index', user_indexRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lunbo', lunboRouter);
app.use('/product', productRouter);
app.use('/comment', commentRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/product', apiProductRouter);
app.use('/api/lunbo', apiLunboRouter);

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
