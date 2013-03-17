
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


    res.render('mustache', {
        title: 'mustache'
        ,layout:false
    });

};