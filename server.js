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
var http1 =require('http').Server(app);
var io = require('socket.io')(http1);
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg_total);
    });
});

sockserver.on('connection', function(conn) {
  console.log('Connected');
  msg_total+='Connected';
  db_connection.query('INSERT INTO stateTable (message) VALUES ("Connected")', function(err, rows, fields) {

    });
  connections.push(conn);
  conn.on('data', function(msg) {
    console.log('Message: ' + msg);
    msg_total+=msg;
    io.sockets.emit('chat message', msg);
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
//var index = fs.readFileSync('views/index.html');
var server = http.createServer(
  function(req,res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("123");
  }
);
sockserver.installHandlers(server, {prefix:'/sockserver'});

server.listen(3000, '0.0.0.0'); 


// var port = process.env.PORT || 8080;
// // set the view engine to ejs
// app.set('view engine', 'ejs');

// // make express look in the public directory for assets (css/js/img)
// app.use(express.static(__dirname + '/public'));

// // set the home page route
// app.get('/', function(req, res) {

// 	// ejs render automatically looks in the views folder
// 	res.render('index');
// });

