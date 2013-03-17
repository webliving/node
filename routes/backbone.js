
exports.getPage = function(req, res){
//    console.log(req);
//    console.log(req.query); // http://localhost:3001/websocket?name=yes
//    console.log(req.param('name'));

    // Send HTML headers and message
//    res.writeHead(200,{ 'Content-Type': 'text/html' });
//      res.write('web');
//     res.end('<h1>Hello Socket Lover!</h1>');

//    res.send('websocket');
//    res.sendfile(__dirname + '/book.js');


    res.render('backbone', {
        title: 'backbone'
        ,layout:true
    });

   /* Post.get(null, function (err, posts) {
        if (err) {
            posts ='test';
        }
        res.render('index', {
            title: posts[0].name
//            title: 'test'
            ,layout:'layout'
        });

    });*/

};