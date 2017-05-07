var mysql      = require('mysql');
var db_connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'mysql',
  database : 'stateDB'
});
db_connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");   
} else {
    console.log("Error connecting database ... nn");    
}
});

    
var msg_total;
var express = require('express');
var app = express();
var http = require('http'),
    sockjs = require('sockjs'),
    sockserver = sockjs.createServer(),
    connections = [];
sockserver.on('connection', function(conn) {
  console.log('Connected');
  msg_total+='Connected';
  db_connection.query('INSERT INTO stateTable (message) VALUES ("Connected")', function(err, rows, fields) {

    });
  connections.push(conn);
  conn.on('data', function(msg) {
    console.log('Message: ' + msg);
    conn.write(msg);
    msg_total+=msg;
    //io.sockets.emit('chat message', msg);
    // send the message to all clients
    for (var i=0; i < connections.length; ++i) {
      connections[i].write(msg);
    }
    db_connection.query('INSERT INTO stateTable (message) VALUES (?)', msg, function(err, rows, fields) {

    });
    
  });
  conn.on('close', function() {
    connections.splice(connections.indexOf(conn), 1); // remove the connection
    console.log('Disconnected');
    msg_total+='Disconnected';
    db_connection.query('INSERT INTO stateTable (message) VALUES ("Disconnected")', function(err, rows, fields) {
      db_connection.end();
    });
  });
});
var fs = require('fs');
var port = process.env.PORT || 3000;

  var server = http.createServer(
    function(req,res){
      res.write('<!doctype html>'+'<html>'+
          '<head>'+
            '<title>Socket.IO chat</title>'+

          '</head>'+
          '<body>'+
            '<div id="messages"></div>'+
            '<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>'+
            '<script src="http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js"></script>'+
            '<script>'+
              'var sock = new SockJS("http://localhost:3000/sockserver");'+
              'var sockjs_url = "/sockserver";'+
              'var sockjs = new SockJS(sockjs_url);'+
              'sockjs.onmessage = function(e)'+
              '{console.log(e.data);'+
              '$("#messages").append($("<div>").html(e.data));'+
              '};'+
                

            '</script>'+
          '</body>'+
        '</html>');
      res.end();
    }
  );
  sockserver.installHandlers(server, {prefix:'/sockserver'});
  server.listen(port); 




// var port = process.env.PORT || 4000;
// // set the view engine to ejs
// app.set('view engine', 'ejs');

// // make express look in the public directory for assets (css/js/img)
// app.use(express.static(__dirname + '/public'));

// // set the home page route
// app.get('/', function(req, res) {

// 	// ejs render automatically looks in the views folder
// 	res.render('index');
// });

// http1.listen(port, function() {
// 	console.log('Our app is running on http://localhost:' + port);
// });