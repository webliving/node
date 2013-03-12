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

/**
 * 获取用户
 * @param username 用户名
 * @param callback 获取成功后的回调
 */
Todos.get = function get(username, callback) {
    
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
            // 查找 name 属性为 username 的文档
            collection.findOne({}, function(err, doc) {
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


// 创建任务
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

            /*var user = {
                name: this.name
                ,email:this.email
                ,pwd: this.pwd
            };*/

            collection.insert(oTodo, {safe: true}, function(err, user) {
                mongodb.close();
                callback(err, user);
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
                /*collection.find({_id:o_id}).toArray(function(err,doc){
                    console.log(doc);

                });*/
                query._id = new BSON.ObjectID(nId);
            }
//            collection.update(query,{$set:{title:"testtest"}});
            // 查找 name 属性为 username 的文档
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

// 拉取 任务列表
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

//            var array = [{'title':'mary',completed:false},{'title':'lily',completed:false}];
            /*collection.insert([],{safe:true},function(err,result){
                if(err) throw err;
            });*/

            // 查找 user 屬性爲 username 的文檔，如果 username 是 null 則匹配全部
            var query = {};
            if (username) {
                query.user = username;
            }


//          collection.find(query).sort({time: -1}).toArray(function(err, docs) {
            collection.find(query).toArray(function(err, docs) {
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