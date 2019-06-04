var compression = require('compression');
var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require('redis');

var redis_cli  = redis.createClient();

var routes = require('./routes/index');
var auth = require('./routes/auth');
var restful = require('./routes/restful');
var toolbox = require('./routes/toolbox');
var cargoaircraft = require('./routes/cargoaircraft');
cargoaircraft.GetCargoAircraftTime();
var middleware = require('./routes/middleware');

var setting = require('./app.setting.json');

var app = express();

/**
 * 印出行數
 * 範例: console.log(__line);
 */
Object.defineProperty(global, '__stack', {
    get: function(){
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack){ return stack; };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__line', {
    get: function(){
        return __stack[1].getLineNumber();
    }
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(busboy());
app.use(session({
    store : new RedisStore({
        host : setting.RedisStore.host,
        port : setting.RedisStore.port,
        client : redis_cli,
        ttl : setting.RedisStore.ttl, //session有效期限-單位s
    }),
    secret : setting.RedisStore.secret,
    // cookie : {
    //     maxAge : 5000 //session有效期限-單位ms
    // },
    saveUninitialized: false,
    resave: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/auth', auth);
app.use('/restful', restful);
app.use('/toolbox', toolbox);
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});
app.get('*', function(req, res) { 
    // console.log(404);
    res.sendFile('404.html', { root: path.join(__dirname, 'public') }, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Send:', '404.html');
        }
    });
    // res.sendfile('../public/404.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        // res.render('error', {
        //     message: err.message,
        //     error: err
        // });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    // res.render('error', {
    //     message: err.message,
    //     error: {}
    // });
});

// module.exports = app;

// server port 3000
app.listen(setting.NodeJs.port, function() {
    return console.info("Express server listening on port " + (this.address().port) + " in " + process.env.NODE_ENV + " mode");
}).on('error', function(err){
    console.log('server error handler');
    console.log(err);
});