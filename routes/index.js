var crypto = require('crypto');
var User = require('../models/user.js');
var Todo = require('../models/db.todo.js');
//var Post = require('../models/post.js');


module.exports=function(app){
    // 首页
    app.get('/',function(req, res){

    //      console.log(req.body);
    //      console.log(req.query); // http://localhost:3001/?web=200  => { web: '200' }
    //      console.log(req.session);
    //      console.log(req.connection.remoteAddress); // 127.0.0.1

      /*Post.get(null, function (err, posts) {
          if (err) {
              posts ='test';
          }
          res.render('index', {
              title: posts[0].name
              ,layout:'layout'
          });

      });*/

        res.render('index', {
            title: 'nodeJS'
            ,layout:'layout'
        });
    });

    // 检查是否已经登录
//    app.get('/*',checkNotLogin);
//    app.post('/*',checkNotLogin);

    // 注册用户
    app.get('/reg', function (req, res) {
        res.render('reg', {
            title:'用戶註冊'
        });
    });
    // 注册用户, 处理提交
    app.post('/reg', function (req, res) {

        //檢驗用戶兩次輸入的口令是否一致
        if (req.body['password-repeat'] != req.body['password']) {
            req.flash('error', '两次输入的密码不一致');
            return res.redirect('/reg');
        }

        //生成口令的散列值
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');

        var newUser = new User({
            name:req.body.username
            ,email:req.body.email
            ,pwd:password
        });

        console.log(newUser);

        //檢查用戶名是否已經存在
        User.get(newUser.name, function (err, user) {
            if (user)
                err = '用户名已存在';
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            //如果不存在則新增用戶
            newUser.save(function (err) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = newUser;
                req.flash('success', '注册成功');
                res.redirect('/');
            });
        });

//        console.log(newUser);
    });


    app.put('/reg', function (req, res) {
        res.render('reg', {
            title:'put 方式-註冊'
        });
    });

    app.delete('/reg', function (req, res) {
        res.render('reg', {
            title:'delete 方式-註冊'
        });
    });

    // 退出登录
    app.get('/logout', function (req, res) {
        req.session.user = null;
        req.flash('success', '登出成功');
        res.redirect('/');
    });

    // ejs 模板测试页面
    app.get('/ejsTest',function(req,res){
        res.render('ejsTest', {
            title: 'ejsTest'
            ,layout:false
        });
    });
    app.get('/jquerym',function(req,res){
        res.render('jquery', {
            title: 'ejsTest'
            ,layout:false
        });
    });

    // backbone
    app.get('/backbone',function(req,res){
        res.render('backbone', {
            title: 'backbone'
            ,layout:true
        });
    });

    // 获取任务
    app.get('/book',function(req, res){
        var id=req.param('id');
        Todo.getList(null,function(err,oTodo){

            res.send(oTodo);

        });

    });


    // 批量更新
    app.put('/book',function(req, res){
//        var id=req.param('id');
        Todo.updateAll(req.body,function(err,oTodo){

            res.send({state:1})
            
        });

    });

    app.delete('/book',function(req, res){
        var id=req.param('del');
        Todo.delList(id,function(err,oTodo){

            res.send({state:1})

        });

    });

    app.get('/book/:id',function(req, res){
        var id=req.param('id');

        res.send([
            {id:1,title:'HTML'},
            {id:2,title:'css'}
        ]);
    });

    // 创建单个任务
    app.post('/book',function(req, res){

        var oTodo=req.body;
        Todo.create(oTodo,function(err,oDoc){

            if(err){
                res.send(err);
            }else{
                // 返回创建的任务,用于客户端生成
                res.send(oDoc[0]);
            }

        });

    });

    // 更新任务
    app.put('/book/:id',function(req, res){
        var id=req.param('id'), // 任务id
            oTodo=req.body; // 更新对象
        delete oTodo._id;
        console.log('更新任务:',oTodo);
        Todo.update(id,oTodo,function(err,oDoc){
            if(!err){
                res.send({state:1})
            }
        });


    });

    // 删除任务
    app.delete('/book/:id',function(req, res){
        var id=req.param('id'),
            oTodo=req.body;

        console.log('删除任务:'+id);
        Todo.delList(id,function(){
            var result={_id:id};
            res.send(result);
        });

    });


    /**
     * 检查是否已经登录
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    function checkNotLogin(req, res, next) {
        console.log('checkNotLogin',req.params);
        if (req.session.user) {
            req.flash('error', '已登入');
            return res.redirect('/');
        }
        next();
    }

// exports end
};
