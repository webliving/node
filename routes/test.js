/*
 * GET home page.
 */

exports.indexPost = function(req, res){

 console.log('Post'); // http://localhost:3001
 console.log(req.body); // http://localhost:3001
 Post.get(null, function (err, posts) {
 if (err) {
 posts ='test';
 }
 res.render('index', {
 title: posts[0].name
 //            title: 'test'
 ,layout:'layout'
 });

 });

 };


exports.indexGet = function(req, res){
 console.log('Get');
 console.log(req.query); // http://localhost:3001/?cleaning_supply=sd
 Post.get(null, function (err, posts) {
 if (err) {
 posts ='test';
 }
 res.render('index', {
 title: posts[0].name
 //            title: 'test'
 ,layout:'layout'
 });

 });

 };


exports.indexPut = function(req, res){
 console.log(req.body); // http://localhost:3001/?cleaning_supply=sd
 Post.get(null, function (err, posts) {
 if (err) {
 posts ='test';
 }
 res.render('index', {
 title: posts[0].name
 //            title: 'test'
 //            ,layout:'layout'
 });

 });

 };