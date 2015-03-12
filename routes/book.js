var User = require('../models/user.js');
//console.log(User);




//创建book :post /book
exports.createBook = function(req, res){
    console.log(req.param('name'));
    var result={_id:125485212};
    res.send(result);
};


//读取book :get /book/:id
exports.readBook = function(req, res){
    var id=req.param('id');

    res.send([
        {id:1,name:'HTML'},
        {id:2,name:'css'}
    ]);
};

//更新book :put /book/:id
exports.updateBook = function(req, res){
    var id=req.param('id');
    console.log('update book:'+id);
    var result={_id:id};
    res.send(result);
};

//删除book :delete /book/:id
exports.delBook = function(req, res){
    var id=req.param('id');
    console.log('delete book:'+id);
    res.send({_id:id});
};