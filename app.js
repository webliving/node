/**
 * Module dependencies.
 */

var express = require('express')
    , partials = require('express-partials')
    , flash = require('connect-flash')
    , routes = require('./routes')
    , settings = require('./mongoSettings')
    , MongoStore = require('connect-mongo')(express)
    , mustache = require('./routes/mustache')
//    , http = require('http')
//    , underscore = require('underscore')
    , path = require('path');


var fs = require('fs');
var accessLogfile = fs.createWriteStream('access.log', {flags:'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags:'a'});


//var app = module.exports = express.createServer();
var app = express();
app.configure(function () {
    app.set('port', process.env.PORT || 3001);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options',{
        layout:false
    });
    // 通过gzip / deflate压缩响应数据. 这个中间件应该放置在所有的中间件最前面以保证所有的返回都是被压缩的
    app.use(express.compress());
//    app.use(express.favicon());
//    app.use(express.logger('dev'));
    app.use(express.logger({stream:accessLogfile}));
    app.use(partials());
    app.use(flash());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret:settings.cookieSecret,
        store:new MongoStore({
            db:settings.db
        })
    }));


//    app.use(app.router);
    app.use(require('less-middleware')({ src:__dirname + '/public' }));
    app.use(express.static(__dirname + '/public'));
//    app.use(express.static(path.join(__dirname, 'public')));


    //请求级信息
    app.use(function (req, res, next) {

        var err = req.flash('error'),
            suc = req.flash('success');
        res.locals.user = req.session ? req.session.user : null;
        err.length ? res.locals.error=err : res.locals.error=null;
        suc.length ? res.locals.success=suc : res.locals.success=null;

        next();
        /*if(!res.locals.user){
            return res.redirect('/reg');
        }*/
    });
});



routes(app);
app.get('/mustache',mustache.getPage);


app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));

//    app.use(express.errorHandler());
});
app.configure('production', function () {
    app.error(function (err, req, res, next) {
        var meta = '[' + new Date() + '] ' + req.url + '\n';
        errorLogfile.write(meta + err.stack + '\n');
        next();
    });
});

var ser=app.listen(3001,function(req,res){
    // console.log(req);
    console.log("Express server listening on port " + app.get('port'));

});

/*
var ser = http.createServer(app).listen(app.get('port'), function () {

    console.log("Express server listening on port " + app.get('port'));


});
console.log(ser.address().port);
*/


/*var serTest=http.createServer(function(req,res){
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write('this is nodeJS web');
    res.end();

}).listen(3001);*/
//console.log(serTest); // 输出端口号







var util = require('util');

function Base() {
    this.name = 'base';
    this.base = 1003;
    this.sayHello = function () {
//        console.log('hello', this.name);
    }
}

Base.prototype.showName = function () {
//    console.log(this.name);
};

function Sub() {
    this.name = 'sub';
}

util.inherits(Sub, Base);

var objBase = new Base();
objBase.sayHello();

var objSub = new Sub();
objSub.showName();

//console.log(util.inspect(objBase,true,null,true));
/*
 underscore.each([200,300],function(v){
 console.log(v);
 });
 */

var events = require('events');
var emitter = new events.EventEmitter();


// 创建 socket 连接
io = require('socket.io').listen(ser);
//添加连接监听
io.sockets.on('connection', function(client){
    client.emit('news', { hello: 'world' });
    //连接成功则执行下面的监听
    client.on('message',function(event){
        console.log('Received message from client!',event);
    });
    //断开连接callback
    client.on('disconnect',function(){
        console.log('Server has disconnected');
    });

    //广播信息给除当前用户之外的用户
//    client.broadcast.emit('user connected');
    //广播给全体客户端
    io.sockets.emit('all users');
});

// 使用 coffee script
/*var test = require('./models/test');
test.hi();*/

