
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.hello = function(req, res){

    // http://localhost:3001/users/webliving
    res.send('hello : '+req.params.username);  // webliving
//    res.send('{name:"web",sex:20}');  // webliving
};

