var mongodb = require('./mongodb');
var mongo = require('mongodb');
/**
 *
 * @param oDoc 用户对象
 * @constructor
 */
function Todos(oDoc) {
//    console.log(user);
    this._id = oDoc._id;
    this.title = oDoc.title;
    this.completed = oDoc.completed;
}
module.exports = Todos;

/*mongodb.open(function(err,db){
    if(err){
        return false;
    }
    db.collection('todo',function(err,collection){
        if(err){
            mongodb.close();
        }
        collection.remove(function(a,b){
            console.log(b);
        });

        collection.insert([
            {
                title:'test1'
                ,completed:false
            },
            {
                title:'test2'
                ,completed:false
            }
        ],{
            safe:true
        },function(err,doc){
            mongodb.close();
            console.log(doc);
        });


    })
});*/
Todos.prototype.save = function save(callback) {
    // 存入 Mongodb 的文檔
    var oTodo = {
        title: this.title
        ,completed:this.completed
    };
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }
        // 讀取 users 集合
        db.collection('todo', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 爲 name 屬性添加索引
//            collection.ensureIndex('name', {unique: true});
            // 寫入 user 文檔
            collection.insert(oTodo, {safe: true}, function(err, user) {
                mongodb.close();
                callback(err, user);
            });
        });
    });
};



// 拉取任务列表
Todos.getList = function getList(username, callback) {

    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        // 讀取 posts 集合
        db.collection('todo', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            // 查找 user 屬性爲 username 的文檔，如果 username 是 null 則匹配全部
            var query = {};
            if (username) {
                query.user = username;
            }


//            collection.find(query).sort({_id: -1}).toArray(function(err, docs) {
            collection.find(query).sort({_id: -1}).limit().toArray(function(err, docs) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                }
                // 封裝 posts 爲 Post 對象
                var posts = [];

                docs.forEach(function(doc, index) {

                    var post = new Todos(doc);
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
    });
};

// 创建 单个任务
Todos.create = function create(oTodo, callback) {

    // 对数据库进行的相关操作都是在db.open()的回调函数内完成
    mongodb.open(function(err, db) {

        if (err) {
            return callback(err);
        }

        // 读取 users 集合
        db.collection('todo', function(err, collection) {
            if (err) {

                mongodb.close();
                return callback(err);
            }

            collection.insert(oTodo, {safe: true}, function(err, aDoc) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                }else{

                    callback(err, aDoc);
                }
            });
        });
    });
};

// 更新
Todos.update = function update(nId,oTodo, callback) {

    // 对数据库进行的相关操作都是在db.open()的回调函数内完成
    mongodb.open(function(err, db) {

        if (err) {
            return callback(err);
        }

        // 读取 users 集合
        db.collection('todo', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            var query = {};
            if (nId) {
                var BSON = mongo.BSONPure;
                query._id = new BSON.ObjectID(nId);
            }

            collection.update(query,{$set:oTodo}, function(err, doc) {
                mongodb.close();
                console.log('doc',doc);
                if (doc) {
                    // 封装文档为 Todos 对象
                    var oDoc = new Todos(doc);
                    callback(err, oDoc);
                } else {
                    callback(err, null);
                }
            });
        });
    });
};


// 批量更新
Todos.updateAll = function updateAll(aTodo, callback) {

    // 对数据库进行的相关操作都是在db.open()的回调函数内完成
    mongodb.open(function(err, db) {

        if (err) {
            return callback(err);
        }

        // 读取 todos 集合
        db.collection('todo', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            for(var i= 0,k=aTodo.length;i<k;i++){
                var query = {};
                var BSON = mongo.BSONPure;
                query._id=new BSON.ObjectID(aTodo[i]._id);

                var oTodo=delete aTodo[i]._id;
//                console.log(query);
                /*if (nId) {
                 var BSON = mongo.BSONPure;
                 query._id = new BSON.ObjectID(nId);
                 }*/
//            collection.update(query,{$set:{title:"testtest"}});
                // 查找 name 属性为 username 的文档
//                console.log(aTodo[i]);
                console.log(query);
                console.log(aTodo[i]);
                collection.update(query,{$set:aTodo[i]}, function(err, doc) {

                    /*if (doc) {
                     var oDoc = new Todos(doc);
                     callback(err, oDoc);
                     } else {
                     callback(err, null);
                     }*/
                });
            }
            mongodb.close();
            callback(err);
        });
    });
};


// 删除任务
Todos.delList = function delList(nId, callback) {

    // 对数据库进行的相关操作都是在db.open()的回调函数内完成
    mongodb.open(function(err, db) {

        if (err) {
            return callback(err);
        }

        // 读取 users 集合
        db.collection('todo', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var aId=[];
            if(nId.indexOf(',')){
                aId=nId.split(',');
            }else{
                aId[0]=nId;
            }

console.log(aId);
            var query = {},
                nIdSize=aId.length,
                BSON = mongo.BSONPure;
            for(var i=0;i<nIdSize;i++){

                query._id = new BSON.ObjectID(aId[i]);

                // 删除查询到的记录
                collection.remove(query, function(err, doc) {
                 //  mongodb.close();
                 // doc >= undefined
                     /*if (doc) {
                     // 封装文档为 任务对象
                     var oDoc = new Todos(doc);

                     } else {
                     callback(err, null);
                     }*/
                 });
            }

            mongodb.close();
            callback(err);
        });
    });
};

